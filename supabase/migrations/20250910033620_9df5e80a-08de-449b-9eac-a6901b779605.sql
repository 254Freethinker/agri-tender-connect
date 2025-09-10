-- Create missing tables for complete agricultural platform

-- Market prices table for price tracking
CREATE TABLE public.market_prices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  commodity_name TEXT NOT NULL,
  market_name TEXT NOT NULL,
  county TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  unit TEXT NOT NULL DEFAULT 'Kg',
  date_recorded TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  source TEXT DEFAULT 'manual',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Bulk orders table
CREATE TABLE public.bulk_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  produce_type TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  unit TEXT NOT NULL DEFAULT 'Kg',
  target_price NUMERIC(10,2),
  buyer_id UUID NOT NULL,
  description TEXT,
  deadline TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- City market bids table
CREATE TABLE public.city_market_bids (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  auction_id TEXT NOT NULL,
  bidder_user_id UUID NOT NULL,
  bid_amount NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  bid_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Flagged markets table
CREATE TABLE public.flagged_markets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  market_id TEXT NOT NULL,
  user_id UUID NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Ban recommendations table  
CREATE TABLE public.ban_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  market_id TEXT NOT NULL,
  user_id UUID NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Inventory items table
CREATE TABLE public.inventory_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  farm_id UUID NOT NULL,
  item_name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity NUMERIC NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'Kg',
  location TEXT,
  expiry_date TIMESTAMP WITH TIME ZONE,
  unit_price NUMERIC(10,2) DEFAULT 0.00,
  total_value NUMERIC(10,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  status TEXT NOT NULL DEFAULT 'available',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User translations table for multi-language support
CREATE TABLE public.user_translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  source_language TEXT NOT NULL DEFAULT 'en',
  target_language TEXT NOT NULL,
  source_text TEXT NOT NULL,
  translated_text TEXT NOT NULL,
  translation_service TEXT NOT NULL DEFAULT 'google',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Chat conversations table
CREATE TABLE public.chat_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL DEFAULT 'New Conversation',
  status TEXT NOT NULL DEFAULT 'active',
  language TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Chat messages table
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL DEFAULT 'user', -- 'user' or 'assistant'
  message_text TEXT NOT NULL,
  message_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.market_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bulk_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.city_market_bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flagged_markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ban_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Market prices viewable by all
CREATE POLICY "Market prices viewable by all" ON public.market_prices FOR SELECT USING (true);
CREATE POLICY "Authenticated users can add prices" ON public.market_prices FOR INSERT TO authenticated WITH CHECK (true);

-- Bulk orders
CREATE POLICY "Bulk orders viewable by all" ON public.bulk_orders FOR SELECT USING (true);
CREATE POLICY "Users can create bulk orders" ON public.bulk_orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Buyers can manage their orders" ON public.bulk_orders FOR UPDATE USING (auth.uid() = buyer_id);

-- City market bids
CREATE POLICY "Bids viewable by all" ON public.city_market_bids FOR SELECT USING (true);
CREATE POLICY "Users can place bids" ON public.city_market_bids FOR INSERT TO authenticated WITH CHECK (auth.uid() = bidder_user_id);

-- Flagged markets (admin only)
CREATE POLICY "Flagged markets viewable by all" ON public.flagged_markets FOR SELECT USING (true);
CREATE POLICY "Users can flag markets" ON public.flagged_markets FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Ban recommendations (admin only)
CREATE POLICY "Ban recommendations viewable by all" ON public.ban_recommendations FOR SELECT USING (true);
CREATE POLICY "Users can create ban recommendations" ON public.ban_recommendations FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Inventory items
CREATE POLICY "Users can manage their inventory" ON public.inventory_items FOR ALL TO authenticated 
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.id = inventory_items.farm_id));

-- User translations
CREATE POLICY "Users can manage their translations" ON public.user_translations FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Chat conversations
CREATE POLICY "Users can manage their conversations" ON public.chat_conversations FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Chat messages
CREATE POLICY "Users can view messages in their conversations" ON public.chat_messages FOR SELECT TO authenticated 
USING (EXISTS (SELECT 1 FROM chat_conversations WHERE chat_conversations.id = chat_messages.conversation_id AND chat_conversations.user_id = auth.uid()));
CREATE POLICY "Users can add messages to their conversations" ON public.chat_messages FOR INSERT TO authenticated 
WITH CHECK (EXISTS (SELECT 1 FROM chat_conversations WHERE chat_conversations.id = chat_messages.conversation_id AND chat_conversations.user_id = auth.uid()));

-- Add update triggers
CREATE TRIGGER update_bulk_orders_updated_at
BEFORE UPDATE ON public.bulk_orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_inventory_items_updated_at
BEFORE UPDATE ON public.inventory_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chat_conversations_updated_at
BEFORE UPDATE ON public.chat_conversations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();