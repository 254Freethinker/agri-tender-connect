-- Create community_post_shares table
CREATE TABLE IF NOT EXISTS public.community_post_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('whatsapp', 'facebook', 'twitter', 'copy_link')),
  shared_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id, platform)
);

-- Create community_post_reposts table
CREATE TABLE IF NOT EXISTS public.community_post_reposts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_post_id UUID NOT NULL,
  reposted_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  repost_caption TEXT,
  reposted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create batch_tracking table
CREATE TABLE IF NOT EXISTS public.batch_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id TEXT NOT NULL UNIQUE,
  farmer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_type TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  unit TEXT NOT NULL DEFAULT 'Kg',
  origin TEXT NOT NULL,
  destination TEXT,
  status TEXT NOT NULL DEFAULT 'in_transit' CHECK (status IN ('in_transit', 'delivered', 'quality_checked', 'recalled')),
  qr_code_url TEXT,
  events JSONB DEFAULT '[]'::jsonb,
  quality_score NUMERIC,
  certifications TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create api_keys table
CREATE TABLE IF NOT EXISTS public.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  key_name TEXT NOT NULL,
  api_key TEXT NOT NULL UNIQUE,
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'premium', 'enterprise')),
  rate_limit INTEGER NOT NULL DEFAULT 500,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_used_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Create api_usage table
CREATE TABLE IF NOT EXISTS public.api_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id UUID NOT NULL REFERENCES api_keys(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  status_code INTEGER NOT NULL,
  response_time_ms INTEGER,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.community_post_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_post_reposts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batch_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies for community_post_shares
CREATE POLICY "Users can view all shares"
ON public.community_post_shares FOR SELECT
USING (true);

CREATE POLICY "Users can create their own shares"
ON public.community_post_shares FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for community_post_reposts
CREATE POLICY "Reposts viewable by all"
ON public.community_post_reposts FOR SELECT
USING (true);

CREATE POLICY "Users can create reposts"
ON public.community_post_reposts FOR INSERT
WITH CHECK (auth.uid() = reposted_by);

CREATE POLICY "Users can delete their reposts"
ON public.community_post_reposts FOR DELETE
USING (auth.uid() = reposted_by);

-- RLS Policies for batch_tracking
CREATE POLICY "Batches viewable by all"
ON public.batch_tracking FOR SELECT
USING (true);

CREATE POLICY "Farmers can manage their batches"
ON public.batch_tracking FOR ALL
USING (auth.uid() = farmer_id);

-- RLS Policies for api_keys
CREATE POLICY "Users can view their own API keys"
ON public.api_keys FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own API keys"
ON public.api_keys FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own API keys"
ON public.api_keys FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own API keys"
ON public.api_keys FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for api_usage
CREATE POLICY "Users can view their API usage"
ON public.api_usage FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM api_keys
    WHERE api_keys.id = api_usage.api_key_id
    AND api_keys.user_id = auth.uid()
  )
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_community_post_shares_post_id ON community_post_shares(post_id);
CREATE INDEX IF NOT EXISTS idx_community_post_shares_user_id ON community_post_shares(user_id);
CREATE INDEX IF NOT EXISTS idx_community_post_reposts_original_post_id ON community_post_reposts(original_post_id);
CREATE INDEX IF NOT EXISTS idx_community_post_reposts_reposted_by ON community_post_reposts(reposted_by);
CREATE INDEX IF NOT EXISTS idx_batch_tracking_batch_id ON batch_tracking(batch_id);
CREATE INDEX IF NOT EXISTS idx_batch_tracking_farmer_id ON batch_tracking(farmer_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_api_key ON api_keys(api_key);
CREATE INDEX IF NOT EXISTS idx_api_usage_api_key_id ON api_usage(api_key_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_timestamp ON api_usage(timestamp);

-- Create trigger for updated_at on batch_tracking
CREATE TRIGGER update_batch_tracking_updated_at
BEFORE UPDATE ON batch_tracking
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();