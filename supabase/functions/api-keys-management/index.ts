import { serve } from 'https://deno.land/std@0.190.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
}

// Input validation schemas
const CreateKeySchema = z.object({
  name: z.string().min(1).max(100).default('Default API Key'),
});

// Generate a secure API key and return both plaintext and hash
async function generateApiKey(): Promise<{ key: string; hash: string; prefix: string }> {
  // Generate 32 bytes of cryptographically secure random data
  const randomBytes = new Uint8Array(32);
  crypto.getRandomValues(randomBytes);
  
  // Convert to base64url-safe string
  const key = `ak_${btoa(String.fromCharCode(...randomBytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
    .substring(0, 40)}`;
  
  // Create SHA-256 hash
  const encoder = new TextEncoder();
  const data = encoder.encode(key);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hash = Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  // Create prefix for identification (first 8 chars)
  const prefix = key.substring(0, 11) + '...';
  
  return { key, hash, prefix };
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false }
  });

  // Get user from auth header
  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Authorization required' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  
  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Invalid token' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }

  try {
    if (req.method === 'GET') {
      // List user's API keys (metadata only - no plaintext keys or hashes)
      const { data: apiKeys, error } = await supabase
        .from('api_keys')
        .select('id, key_name, key_prefix, is_active, last_used_at, created_at, expires_at, tier, rate_limit')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Fetch API keys error:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch API keys' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      return new Response(JSON.stringify({ data: apiKeys }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    if (req.method === 'POST') {
      // Validate input
      const body = await req.json();
      const validated = CreateKeySchema.parse(body);
      
      // Generate new API key with hash
      const { key, hash, prefix } = await generateApiKey();

      // Store only the hash, not the plaintext key
      const { data: newKey, error } = await supabase
        .from('api_keys')
        .insert({
          user_id: user.id,
          key_name: validated.name,
          key_hash: hash,
          key_prefix: prefix,
          api_key: hash, // Store hash in legacy column for backwards compatibility
          is_active: true,
          tier: 'free',
          rate_limit: 500
        })
        .select('id, key_name, key_prefix, created_at, tier, rate_limit')
        .single();

      if (error) {
        console.error('Create API key error:', error);
        return new Response(JSON.stringify({ error: 'Failed to create API key' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      // Return the plaintext key ONLY ONCE - user must save it
      return new Response(JSON.stringify({
        message: 'API key created successfully. Save this key securely - it will not be shown again.',
        api_key: key, // Only returned once!
        key_info: {
          id: newKey.id,
          name: newKey.key_name,
          prefix: newKey.key_prefix,
          created_at: newKey.created_at,
          tier: newKey.tier,
          rate_limit: newKey.rate_limit
        }
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    if (req.method === 'DELETE') {
      // Delete API key
      const url = new URL(req.url);
      const keyId = url.searchParams.get('id');
      
      if (!keyId) {
        return new Response(JSON.stringify({ error: 'Key ID required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      // Validate UUID format
      const uuidSchema = z.string().uuid();
      try {
        uuidSchema.parse(keyId);
      } catch {
        return new Response(JSON.stringify({ error: 'Invalid key ID format' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', keyId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Delete API key error:', error);
        return new Response(JSON.stringify({ error: 'Failed to delete API key' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      return new Response(JSON.stringify({ message: 'API key deleted successfully' }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });

  } catch (error) {
    console.error('API Keys Management error:', error);
    
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ 
        error: 'Validation failed', 
        details: error.errors 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
    
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
});
