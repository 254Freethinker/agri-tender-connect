-- Create community_posts table for social features
CREATE TABLE IF NOT EXISTS public.community_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  images TEXT[],
  category TEXT NOT NULL DEFAULT 'general',
  likes_count INTEGER NOT NULL DEFAULT 0,
  comments_count INTEGER NOT NULL DEFAULT 0,
  shares_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create community_comments table
CREATE TABLE IF NOT EXISTS public.community_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create community_reports table for moderation
CREATE TABLE IF NOT EXISTS public.community_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reported_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reported_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  reported_post_id UUID,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  resolution_notes TEXT,
  resolved_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create food_rescue_claims table to track who claimed donations
CREATE TABLE IF NOT EXISTS public.food_rescue_claims (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID NOT NULL,
  claimer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  claimed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_rescue_claims ENABLE ROW LEVEL SECURITY;

-- RLS Policies for community_posts
CREATE POLICY "Posts are viewable by everyone"
  ON public.community_posts FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own posts"
  ON public.community_posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts"
  ON public.community_posts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts"
  ON public.community_posts FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for community_comments
CREATE POLICY "Comments are viewable by everyone"
  ON public.community_comments FOR SELECT
  USING (true);

CREATE POLICY "Users can create comments"
  ON public.community_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON public.community_comments FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for community_reports
CREATE POLICY "Users can view their own reports"
  ON public.community_reports FOR SELECT
  USING (auth.uid() = reported_by);

CREATE POLICY "Users can create reports"
  ON public.community_reports FOR INSERT
  WITH CHECK (auth.uid() = reported_by);

-- RLS Policies for food_rescue_claims
CREATE POLICY "Claims are viewable by parties involved"
  ON public.food_rescue_claims FOR SELECT
  USING (auth.uid() = claimer_id);

CREATE POLICY "Users can create claims"
  ON public.food_rescue_claims FOR INSERT
  WITH CHECK (auth.uid() = claimer_id);

-- Create updated_at triggers
CREATE TRIGGER update_community_posts_updated_at
  BEFORE UPDATE ON public.community_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_community_posts_user_id ON public.community_posts(user_id);
CREATE INDEX idx_community_posts_category ON public.community_posts(category);
CREATE INDEX idx_community_posts_created_at ON public.community_posts(created_at DESC);
CREATE INDEX idx_community_comments_post_id ON public.community_comments(post_id);
CREATE INDEX idx_community_reports_status ON public.community_reports(status);
CREATE INDEX idx_food_rescue_claims_listing_id ON public.food_rescue_claims(listing_id);