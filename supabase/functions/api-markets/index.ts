
import { serve } from 'https://deno.land/std@0.190.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

interface AuthResult {
  valid: boolean;
  user_id?: string;
  api_key_id?: string;
  subscription_type?: string;
  user_name?: string;
  user_email?: string;
  error?: string;
}

interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  reset_time: string;
  current_usage: number;
}

async function authenticateRequest(req: Request): Promise<AuthResult> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  const apiKey = req.headers.get('x-api-key') || req.headers.get('authorization')?.replace('Bearer ', '')
  
  if (!apiKey) {
    return { valid: false, error: 'API key required' }
  }

  const encoder = new TextEncoder()
  const data = encoder.encode(apiKey)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const keyHash = Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')

  try {
    const { data: result, error } = await supabase.rpc('validate_api_key', { p_key_hash: keyHash })
    
    if (error) {
      console.error('API key validation error:', error)
      return { valid: false, error: 'Authentication failed' }
    }

    return result as AuthResult
  } catch (error: unknown) {
    console.error('Authentication error:', error)
    return { valid: false, error: 'Authentication failed' }
  }
}

async function checkRateLimit(userId: string, subscriptionType: string): Promise<RateLimitResult> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    const { data: result, error } = await supabase.rpc('check_rate_limit', {
      p_user_id: userId,
      p_subscription_type: subscriptionType
    })
    
    if (error) {
      console.error('Rate limit check error:', error)
      return { allowed: false, limit: 0, remaining: 0, reset_time: '', current_usage: 0 }
    }

    return result as RateLimitResult
  } catch (error: unknown) {
    console.error('Rate limit error:', error)
    return { allowed: false, limit: 0, remaining: 0, reset_time: '', current_usage: 0 }
  }
}

async function logApiUsage(
  userId: string, 
  apiKeyId: string, 
  endpoint: string, 
  method: string, 
  statusCode: number, 
  responseTimeMs: number,
  req: Request
) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    await supabase.from('api_usage').insert({
      user_id: userId,
      api_key_id: apiKeyId,
      endpoint,
      method,
      status_code: statusCode,
      response_time_ms: responseTimeMs,
      ip_address: req.headers.get('x-forwarded-for') || 'unknown',
      user_agent: req.headers.get('user-agent') || 'unknown'
    })
  } catch (error: unknown) {
    console.error('Failed to log API usage:', error)
  }
}

function createApiResponse(data: unknown, status: number = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
      ...headers
    }
  })
}

function createErrorResponse(message: string, status: number = 400) {
  return createApiResponse({ error: message }, status)
}

serve(async (req: Request): Promise<Response> => {
  const startTime = Date.now()
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const auth = await authenticateRequest(req)
    if (!auth.valid) {
      return createErrorResponse(auth.error || 'Unauthorized', 401)
    }

    // Developer tier or higher required for market data
    if (auth.subscription_type === 'free') {
      await logApiUsage(auth.user_id!, auth.api_key_id!, '/api/v1/markets', req.method, 403, Date.now() - startTime, req)
      return createErrorResponse('Developer subscription required for market data access', 403)
    }

    const rateLimit = await checkRateLimit(auth.user_id!, auth.subscription_type!)
    if (!rateLimit.allowed) {
      return createErrorResponse('Rate limit exceeded', 429)
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const url = new URL(req.url)
    const county = url.searchParams.get('county')
    const commodity = url.searchParams.get('commodity')
    const limit = parseInt(url.searchParams.get('limit') || '50')

    let query = supabase.from('market_prices').select(`
      id,
      market_id,
      market_name,
      county,
      commodity_name,
      price,
      unit,
      date_recorded,
      confidence_score,
      verified,
      source
    `).order('date_recorded', { ascending: false })

    if (county) {
      query = query.ilike('county', `%${county}%`)
    }
    if (commodity) {
      query = query.ilike('commodity_name', `%${commodity}%`)
    }

    // Apply subscription limits
    if (auth.subscription_type === 'developer') {
      query = query.limit(Math.min(limit, 200))
    } else {
      query = query.limit(limit)
    }

    const { data: markets, error } = await query

    if (error) {
      console.error('Database error:', error)
      return createErrorResponse('Internal server error', 500)
    }

    // Group by market and get latest prices
    const marketData = markets?.reduce((acc: Record<string, unknown>, price: Record<string, unknown>) => {
      const marketKey = `${price.market_id}-${price.county}`
      if (!acc[marketKey]) {
        acc[marketKey] = {
          id: price.market_id,
          name: price.market_name,
          county: price.county,
          prices: []
        }
      }
      (acc[marketKey] as { prices: unknown[] }).prices.push({
        commodity: price.commodity_name,
        price: price.price,
        unit: price.unit,
        date: price.date_recorded,
        confidence: price.confidence_score,
        verified: price.verified
      })
      return acc
    }, {})

    const responseTime = Date.now() - startTime
    await logApiUsage(auth.user_id!, auth.api_key_id!, '/api/v1/markets', req.method, 200, responseTime, req)

    return createApiResponse({
      data: Object.values(marketData || {}),
      meta: {
        count: Object.keys(marketData || {}).length,
        subscription_type: auth.subscription_type,
        rate_limit: {
          remaining: rateLimit.remaining,
          limit: rateLimit.limit
        }
      }
    })

  } catch (error: unknown) {
    console.error('API error:', error)
    return createErrorResponse('Internal server error', 500)
  }
})
