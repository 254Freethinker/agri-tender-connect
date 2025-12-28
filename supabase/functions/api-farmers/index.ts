
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
  } catch (error) {
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
  } catch (error) {
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
  } catch (error) {
    console.error('Failed to log API usage:', error)
  }
}

function createApiResponse(data: any, status: number = 200, headers: Record<string, string> = {}) {
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
    // Authenticate the request
    const auth = await authenticateRequest(req)
    if (!auth.valid) {
      await logApiUsage('', '', '/api/v1/farmers', req.method, 401, Date.now() - startTime, req)
      return createErrorResponse(auth.error || 'Unauthorized', 401)
    }

    // Check rate limits
    const rateLimit = await checkRateLimit(auth.user_id!, auth.subscription_type!)
    if (!rateLimit.allowed) {
      await logApiUsage(auth.user_id!, auth.api_key_id!, '/api/v1/farmers', req.method, 429, Date.now() - startTime, req)
      return createErrorResponse('Rate limit exceeded', 429)
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const url = new URL(req.url)
    const county = url.searchParams.get('county')
    const limit = parseInt(url.searchParams.get('limit') || '50')
    const offset = parseInt(url.searchParams.get('offset') || '0')

    // Build query based on subscription level
    let query = supabase.from('profiles').select(`
      id,
      full_name,
      county,
      contact_number,
      email,
      role,
      created_at
    `).eq('role', 'farmer')

    // Apply subscription-based filters
    if (auth.subscription_type === 'free') {
      // Free tier: Limited data, no contact info
      query = supabase.from('profiles').select(`
        id,
        full_name,
        county,
        created_at
      `).eq('role', 'farmer').limit(10)
    } else if (auth.subscription_type === 'developer') {
      // Developer tier: More data, limited contact info
      query = supabase.from('profiles').select(`
        id,
        full_name,
        county,
        email,
        role,
        created_at
      `).eq('role', 'farmer').limit(100)
    }
    // Enterprise gets full access

    if (county) {
      query = query.ilike('county', `%${county}%`)
    }

    query = query.range(offset, offset + limit - 1)

    const { data: farmers, error } = await query

    if (error) {
      console.error('Database error:', error)
      await logApiUsage(auth.user_id!, auth.api_key_id!, '/api/v1/farmers', req.method, 500, Date.now() - startTime, req)
      return createErrorResponse('Internal server error', 500)
    }

    // Transform data based on subscription
    const transformedData = farmers?.map(farmer => {
      const baseData = {
        id: farmer.id,
        name: farmer.full_name,
        county: farmer.county,
        joinDate: farmer.created_at
      }

      if (auth.subscription_type === 'free') {
        return {
          ...baseData,
          contact: 'Upgrade to Developer tier for contact info'
        }
      }

      if (auth.subscription_type === 'developer') {
        return {
          ...baseData,
          email: farmer.email,
          contact: 'Upgrade to Enterprise for full contact details'
        }
      }

      // Enterprise tier gets everything
      return {
        ...baseData,
        email: farmer.email,
        phone: farmer.contact_number,
        role: farmer.role
      }
    })

    const responseTime = Date.now() - startTime
    await logApiUsage(auth.user_id!, auth.api_key_id!, '/api/v1/farmers', req.method, 200, responseTime, req)

    return createApiResponse({
      data: transformedData,
      meta: {
        count: farmers?.length || 0,
        limit,
        offset,
        subscription_type: auth.subscription_type,
        rate_limit: {
          remaining: rateLimit.remaining,
          limit: rateLimit.limit,
          reset_time: rateLimit.reset_time
        }
      }
    })

  } catch (error) {
    console.error('API error:', error)
    return createErrorResponse('Internal server error', 500)
  }
})
