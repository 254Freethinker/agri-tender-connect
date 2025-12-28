-- ====================================================================
-- COMPREHENSIVE DATABASE SCHEMA - MISSING TABLES
-- ====================================================================

-- ====================================================================
-- 1. USER PROFILES - Extended version (keeping existing profiles table)
-- ====================================================================
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS business_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS business_registration_number VARCHAR(100),
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS city VARCHAR(100),
ADD COLUMN IF NOT EXISTS county VARCHAR(100),
ADD COLUMN IF NOT EXISTS country VARCHAR(100) DEFAULT 'Kenya',
ADD COLUMN IF NOT EXISTS postal_code VARCHAR(20),
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS verification_date TIMESTAMP,
ADD COLUMN IF NOT EXISTS verification_method VARCHAR(50),
ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_sales INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS account_balance DECIMAL(12,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS kyc_status VARCHAR(20) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS kyc_submitted_date TIMESTAMP,
ADD COLUMN IF NOT EXISTS kyc_approved_date TIMESTAMP,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS website_url TEXT;

-- ====================================================================
-- 2. CITY MARKETS (referenced by market_prices and schedules)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.city_markets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  market_name VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  county VARCHAR(100) NOT NULL,
  address TEXT,
  GPS_latitude DECIMAL(9,6),
  GPS_longitude DECIMAL(9,6),
  description TEXT,
  market_type VARCHAR(50), -- wholesale, retail, mixed
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.city_markets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "City markets viewable by all" ON public.city_markets FOR SELECT USING (true);

-- ====================================================================
-- 3. SUBSCRIPTION BOXES (referenced by subscriptions)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.subscription_boxes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  box_name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(12,2) NOT NULL,
  box_size VARCHAR(50), -- small, medium, large
  contents_description TEXT,
  available_frequencies TEXT[], -- weekly, bi-weekly, monthly
  is_active BOOLEAN DEFAULT TRUE,
  max_subscribers INTEGER,
  current_subscribers INTEGER DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.subscription_boxes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Subscription boxes viewable by all" ON public.subscription_boxes FOR SELECT USING (true);
CREATE POLICY "Farmers can manage their boxes" ON public.subscription_boxes FOR ALL USING (auth.uid() = farmer_id);

-- ====================================================================
-- 4. SELLER RATINGS & REVIEWS
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.seller_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_title VARCHAR(255),
  review_text TEXT,
  transaction_id UUID,
  is_verified_purchase BOOLEAN DEFAULT FALSE,
  helpful_count INTEGER DEFAULT 0,
  unhelpful_count INTEGER DEFAULT 0,
  seller_response TEXT,
  seller_response_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(seller_id, reviewer_id, transaction_id)
);

CREATE INDEX idx_seller_ratings_seller_id ON public.seller_ratings(seller_id);
CREATE INDEX idx_seller_ratings_reviewer_id ON public.seller_ratings(reviewer_id);
CREATE INDEX idx_seller_ratings_rating ON public.seller_ratings(rating);
CREATE INDEX idx_seller_ratings_created_at ON public.seller_ratings(created_at DESC);

ALTER TABLE public.seller_ratings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Seller ratings viewable by all" ON public.seller_ratings FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON public.seller_ratings FOR INSERT WITH CHECK (auth.uid() = reviewer_id);
CREATE POLICY "Users can update their reviews" ON public.seller_ratings FOR UPDATE USING (auth.uid() = reviewer_id);

-- ====================================================================
-- 5. PRODUCT REVIEWS
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL,
  product_type VARCHAR(50) NOT NULL,
  reviewer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_title VARCHAR(255),
  review_text TEXT,
  photo_urls TEXT[],
  video_url TEXT,
  quality_rating INTEGER,
  delivery_rating INTEGER,
  seller_communication_rating INTEGER,
  is_verified_purchase BOOLEAN DEFAULT FALSE,
  helpful_count INTEGER DEFAULT 0,
  unhelpful_count INTEGER DEFAULT 0,
  seller_response TEXT,
  seller_response_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_product_reviews_product_id ON public.product_reviews(product_id);
CREATE INDEX idx_product_reviews_product_type ON public.product_reviews(product_type);
CREATE INDEX idx_product_reviews_reviewer_id ON public.product_reviews(reviewer_id);
CREATE INDEX idx_product_reviews_rating ON public.product_reviews(rating);
CREATE INDEX idx_product_reviews_created_at ON public.product_reviews(created_at DESC);

ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Product reviews viewable by all" ON public.product_reviews FOR SELECT USING (true);
CREATE POLICY "Users can create product reviews" ON public.product_reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);
CREATE POLICY "Users can update their product reviews" ON public.product_reviews FOR UPDATE USING (auth.uid() = reviewer_id);

-- ====================================================================
-- 6. INQUIRIES & QUOTATIONS
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL,
  product_type VARCHAR(50) NOT NULL,
  seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  inquiry_type VARCHAR(30) NOT NULL DEFAULT 'general',
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  quantity_requested INTEGER,
  delivery_required BOOLEAN DEFAULT FALSE,
  delivery_location TEXT,
  price_range_min DECIMAL(12,2),
  price_range_max DECIMAL(12,2),
  urgency VARCHAR(20) DEFAULT 'normal',
  status VARCHAR(20) DEFAULT 'pending',
  seller_response TEXT,
  seller_response_date TIMESTAMP,
  quoted_price DECIMAL(12,2),
  quote_validity_days INTEGER DEFAULT 30,
  quote_expiry_date TIMESTAMP,
  viewed_by_seller BOOLEAN DEFAULT FALSE,
  viewed_by_seller_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_inquiries_product_id ON public.inquiries(product_id);
CREATE INDEX idx_inquiries_seller_id ON public.inquiries(seller_id);
CREATE INDEX idx_inquiries_buyer_id ON public.inquiries(buyer_id);
CREATE INDEX idx_inquiries_status ON public.inquiries(status);
CREATE INDEX idx_inquiries_created_at ON public.inquiries(created_at DESC);

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their inquiries" ON public.inquiries FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
CREATE POLICY "Buyers can create inquiries" ON public.inquiries FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Parties can update inquiries" ON public.inquiries FOR UPDATE USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- ====================================================================
-- 7. CONVERSATIONS & MESSAGES
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant1_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  participant2_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID,
  product_type VARCHAR(50),
  subject VARCHAR(255),
  last_message_content TEXT,
  last_message_date TIMESTAMP,
  participant1_unread_count INTEGER DEFAULT 0,
  participant2_unread_count INTEGER DEFAULT 0,
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_conversations_participant1_id ON public.conversations(participant1_id);
CREATE INDEX idx_conversations_participant2_id ON public.conversations(participant2_id);
CREATE INDEX idx_conversations_product_id ON public.conversations(product_id);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their conversations" ON public.conversations FOR SELECT USING (auth.uid() = participant1_id OR auth.uid() = participant2_id);
CREATE POLICY "Users can create conversations" ON public.conversations FOR INSERT WITH CHECK (auth.uid() = participant1_id OR auth.uid() = participant2_id);
CREATE POLICY "Users can update their conversations" ON public.conversations FOR UPDATE USING (auth.uid() = participant1_id OR auth.uid() = participant2_id);

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message_text TEXT NOT NULL,
  file_urls TEXT[],
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  deleted_by_sender BOOLEAN DEFAULT FALSE,
  deleted_by_receiver BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON public.messages(receiver_id);
CREATE INDEX idx_messages_is_read ON public.messages(is_read);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their messages" ON public.messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update their messages" ON public.messages FOR UPDATE USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- ====================================================================
-- 8. SHOPPING CART
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.shopping_carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  total_items INTEGER DEFAULT 0,
  subtotal DECIMAL(12,2) DEFAULT 0,
  tax DECIMAL(12,2) DEFAULT 0,
  shipping_cost DECIMAL(12,2) DEFAULT 0,
  total_amount DECIMAL(12,2) DEFAULT 0,
  coupon_code VARCHAR(50),
  discount_amount DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.shopping_carts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their cart" ON public.shopping_carts FOR ALL USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID NOT NULL REFERENCES public.shopping_carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL,
  product_type VARCHAR(50) NOT NULL,
  seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(12,2) NOT NULL,
  item_total DECIMAL(12,2) NOT NULL,
  custom_attributes JSONB,
  added_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_cart_items_cart_id ON public.cart_items(cart_id);
CREATE INDEX idx_cart_items_product_id ON public.cart_items(product_id);
CREATE INDEX idx_cart_items_seller_id ON public.cart_items(seller_id);

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their cart items" ON public.cart_items FOR ALL USING (
  EXISTS (SELECT 1 FROM public.shopping_carts WHERE shopping_carts.id = cart_items.cart_id AND shopping_carts.user_id = auth.uid())
);

-- ====================================================================
-- 9. ORDERS & ORDER ITEMS
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  order_status VARCHAR(30) DEFAULT 'pending',
  payment_status VARCHAR(30) DEFAULT 'unpaid',
  delivery_status VARCHAR(30) DEFAULT 'not_shipped',
  subtotal DECIMAL(12,2) NOT NULL,
  tax DECIMAL(12,2) DEFAULT 0,
  shipping_cost DECIMAL(12,2) DEFAULT 0,
  discount_amount DECIMAL(12,2) DEFAULT 0,
  total_amount DECIMAL(12,2) NOT NULL,
  payment_method VARCHAR(50),
  payment_reference VARCHAR(100),
  payment_date TIMESTAMP,
  shipping_address TEXT NOT NULL,
  shipping_city VARCHAR(100),
  shipping_county VARCHAR(100),
  shipping_postal_code VARCHAR(20),
  tracking_number VARCHAR(100),
  estimated_delivery_date DATE,
  actual_delivery_date TIMESTAMP,
  notes TEXT,
  cancellation_reason TEXT,
  cancellation_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_orders_order_number ON public.orders(order_number);
CREATE INDEX idx_orders_buyer_id ON public.orders(buyer_id);
CREATE INDEX idx_orders_seller_id ON public.orders(seller_id);
CREATE INDEX idx_orders_order_status ON public.orders(order_status);
CREATE INDEX idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their orders" ON public.orders FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
CREATE POLICY "Buyers can create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Parties can update orders" ON public.orders FOR UPDATE USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  product_type VARCHAR(50) NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(12,2) NOT NULL,
  item_total DECIMAL(12,2) NOT NULL,
  custom_attributes JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_order_items_product_id ON public.order_items(product_id);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND (orders.buyer_id = auth.uid() OR orders.seller_id = auth.uid()))
);
CREATE POLICY "Buyers can create order items" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.buyer_id = auth.uid())
);

-- ====================================================================
-- 10. PAYMENTS
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  payment_method VARCHAR(50) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'KES',
  payment_status VARCHAR(30) DEFAULT 'pending',
  payment_reference VARCHAR(100),
  payment_gateway_response JSONB,
  mpesa_phone VARCHAR(20),
  mpesa_receipt_number VARCHAR(50),
  card_last_4 VARCHAR(4),
  bank_name VARCHAR(100),
  bank_account_number VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_payments_order_id ON public.payments(order_id);
CREATE INDEX idx_payments_payment_status ON public.payments(payment_status);
CREATE INDEX idx_payments_payment_reference ON public.payments(payment_reference);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their payments" ON public.payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = payments.order_id AND (orders.buyer_id = auth.uid() OR orders.seller_id = auth.uid()))
);
CREATE POLICY "Buyers can create payments" ON public.payments FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = payments.order_id AND orders.buyer_id = auth.uid())
);

-- ====================================================================
-- 11. DELIVERY ADDRESSES
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.delivery_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  address_type VARCHAR(30) DEFAULT 'delivery',
  recipient_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  street_address TEXT NOT NULL,
  apartment_number VARCHAR(50),
  city VARCHAR(100) NOT NULL,
  county VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'Kenya',
  landmark TEXT,
  delivery_instructions TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_delivery_addresses_user_id ON public.delivery_addresses(user_id);

ALTER TABLE public.delivery_addresses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their addresses" ON public.delivery_addresses FOR ALL USING (auth.uid() = user_id);

-- ====================================================================
-- 12. DELIVERY TRACKING
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.delivery_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL UNIQUE REFERENCES public.orders(id) ON DELETE CASCADE,
  tracking_number VARCHAR(100) UNIQUE,
  courier_service VARCHAR(100),
  courier_phone VARCHAR(20),
  current_location TEXT,
  current_status VARCHAR(50),
  estimated_arrival TIMESTAMP,
  last_updated TIMESTAMP DEFAULT NOW(),
  GPS_latitude DECIMAL(9,6),
  GPS_longitude DECIMAL(9,6),
  delivery_proof_photo_url TEXT,
  signature_url TEXT,
  recipient_name_on_delivery VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_delivery_tracking_order_id ON public.delivery_tracking(order_id);
CREATE INDEX idx_delivery_tracking_tracking_number ON public.delivery_tracking(tracking_number);

ALTER TABLE public.delivery_tracking ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their delivery tracking" ON public.delivery_tracking FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = delivery_tracking.order_id AND (orders.buyer_id = auth.uid() OR orders.seller_id = auth.uid()))
);
CREATE POLICY "Sellers can update delivery tracking" ON public.delivery_tracking FOR ALL USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = delivery_tracking.order_id AND orders.seller_id = auth.uid())
);

-- ====================================================================
-- 13. BULK ORDER PARTICIPANTS
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.bulk_order_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bulk_order_id UUID NOT NULL REFERENCES public.bulk_orders(id) ON DELETE CASCADE,
  participant_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  quantity_committed DECIMAL(10,2) NOT NULL,
  payment_amount DECIMAL(12,2),
  payment_status VARCHAR(30) DEFAULT 'pending',
  payment_due_date DATE,
  payment_date TIMESTAMP,
  delivery_address_id UUID REFERENCES public.delivery_addresses(id),
  status VARCHAR(30) DEFAULT 'joined',
  joined_date TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_bulk_order_participants_bulk_order_id ON public.bulk_order_participants(bulk_order_id);
CREATE INDEX idx_bulk_order_participants_participant_id ON public.bulk_order_participants(participant_id);
CREATE INDEX idx_bulk_order_participants_payment_status ON public.bulk_order_participants(payment_status);

ALTER TABLE public.bulk_order_participants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Participants can view bulk order participants" ON public.bulk_order_participants FOR SELECT USING (
  auth.uid() = participant_id OR EXISTS (SELECT 1 FROM public.bulk_orders WHERE bulk_orders.id = bulk_order_participants.bulk_order_id AND bulk_orders.buyer_id = auth.uid())
);
CREATE POLICY "Users can join bulk orders" ON public.bulk_order_participants FOR INSERT WITH CHECK (auth.uid() = participant_id);
CREATE POLICY "Participants can update their participation" ON public.bulk_order_participants FOR UPDATE USING (auth.uid() = participant_id);

-- ====================================================================
-- 14. BULK ORDER MESSAGES
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.bulk_order_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bulk_order_id UUID NOT NULL REFERENCES public.bulk_orders(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message_type VARCHAR(50) DEFAULT 'general',
  title VARCHAR(255),
  content TEXT NOT NULL,
  attachment_urls TEXT[],
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_bulk_order_messages_bulk_order_id ON public.bulk_order_messages(bulk_order_id);
CREATE INDEX idx_bulk_order_messages_sender_id ON public.bulk_order_messages(sender_id);

ALTER TABLE public.bulk_order_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Bulk order participants can view messages" ON public.bulk_order_messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.bulk_order_participants WHERE bulk_order_participants.bulk_order_id = bulk_order_messages.bulk_order_id AND bulk_order_participants.participant_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.bulk_orders WHERE bulk_orders.id = bulk_order_messages.bulk_order_id AND bulk_orders.buyer_id = auth.uid())
);
CREATE POLICY "Participants can send messages" ON public.bulk_order_messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- ====================================================================
-- 15. SUBSCRIPTIONS
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  box_id UUID NOT NULL REFERENCES public.subscription_boxes(id) ON DELETE CASCADE,
  subscription_status VARCHAR(30) DEFAULT 'active',
  subscription_start_date DATE NOT NULL,
  subscription_end_date DATE,
  frequency VARCHAR(20) NOT NULL,
  next_delivery_date DATE,
  total_deliveries INTEGER DEFAULT 0,
  completed_deliveries INTEGER DEFAULT 0,
  auto_renew BOOLEAN DEFAULT TRUE,
  payment_status VARCHAR(30) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  cancelled_date TIMESTAMP,
  cancellation_reason TEXT
);

CREATE INDEX idx_subscriptions_subscriber_id ON public.subscriptions(subscriber_id);
CREATE INDEX idx_subscriptions_box_id ON public.subscriptions(box_id);
CREATE INDEX idx_subscriptions_subscription_status ON public.subscriptions(subscription_status);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their subscriptions" ON public.subscriptions FOR ALL USING (auth.uid() = subscriber_id);
CREATE POLICY "Farmers can view subscriptions to their boxes" ON public.subscriptions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.subscription_boxes WHERE subscription_boxes.id = subscriptions.box_id AND subscription_boxes.farmer_id = auth.uid())
);

-- ====================================================================
-- 16. SUBSCRIPTION CUSTOMIZATIONS
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.subscription_customizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL UNIQUE REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  exclude_items TEXT[],
  include_items TEXT[],
  allergies TEXT[],
  dietary_restrictions TEXT[],
  special_requests TEXT,
  organic_only BOOLEAN DEFAULT FALSE,
  local_only BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.subscription_customizations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their subscription customizations" ON public.subscription_customizations FOR ALL USING (
  EXISTS (SELECT 1 FROM public.subscriptions WHERE subscriptions.id = subscription_customizations.subscription_id AND subscriptions.subscriber_id = auth.uid())
);

-- ====================================================================
-- 17. FARM GALLERIES
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.farm_galleries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  caption TEXT,
  photo_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_farm_galleries_farmer_id ON public.farm_galleries(farmer_id);

ALTER TABLE public.farm_galleries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Farm galleries viewable by all" ON public.farm_galleries FOR SELECT USING (true);
CREATE POLICY "Farmers can manage their galleries" ON public.farm_galleries FOR ALL USING (auth.uid() = farmer_id);

-- ====================================================================
-- 18. NOTIFICATION PREFERENCES
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT TRUE,
  sms_notifications BOOLEAN DEFAULT TRUE,
  push_notifications BOOLEAN DEFAULT TRUE,
  in_app_notifications BOOLEAN DEFAULT TRUE,
  order_updates BOOLEAN DEFAULT TRUE,
  message_notifications BOOLEAN DEFAULT TRUE,
  review_notifications BOOLEAN DEFAULT TRUE,
  promotion_notifications BOOLEAN DEFAULT TRUE,
  digest_frequency VARCHAR(30) DEFAULT 'daily',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their notification preferences" ON public.notification_preferences FOR ALL USING (auth.uid() = user_id);

-- ====================================================================
-- 19. WISHLISTS
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL DEFAULT 'My Wishlist',
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their wishlists" ON public.wishlists FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public wishlists viewable by all" ON public.wishlists FOR SELECT USING (is_public = true);

CREATE TABLE IF NOT EXISTS public.wishlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wishlist_id UUID NOT NULL REFERENCES public.wishlists(id) ON DELETE CASCADE,
  product_id UUID NOT NULL,
  product_type VARCHAR(50) NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  product_image_url TEXT,
  seller_id UUID REFERENCES public.profiles(id),
  price_at_save DECIMAL(12,2),
  current_price DECIMAL(12,2),
  date_saved TIMESTAMP DEFAULT NOW(),
  notes TEXT
);

CREATE INDEX idx_wishlist_items_wishlist_id ON public.wishlist_items(wishlist_id);

ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their wishlist items" ON public.wishlist_items FOR ALL USING (
  EXISTS (SELECT 1 FROM public.wishlists WHERE wishlists.id = wishlist_items.wishlist_id AND wishlists.user_id = auth.uid())
);

-- ====================================================================
-- 20. MARKET TRADING SCHEDULES
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.market_trading_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  market_id UUID NOT NULL REFERENCES public.city_markets(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL,
  opening_time TIME NOT NULL,
  closing_time TIME NOT NULL,
  is_trading_day BOOLEAN DEFAULT TRUE,
  special_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.market_trading_schedules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Market schedules viewable by all" ON public.market_trading_schedules FOR SELECT USING (true);

-- ====================================================================
-- 21. DISPUTES
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  claimant_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  respondent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  dispute_type VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  evidence_urls TEXT[],
  dispute_status VARCHAR(30) DEFAULT 'open',
  resolution_type VARCHAR(50),
  resolution_amount DECIMAL(12,2),
  mediator_id UUID REFERENCES public.profiles(id),
  mediator_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_disputes_order_id ON public.disputes(order_id);
CREATE INDEX idx_disputes_claimant_id ON public.disputes(claimant_id);
CREATE INDEX idx_disputes_dispute_status ON public.disputes(dispute_status);

ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Dispute parties can view disputes" ON public.disputes FOR SELECT USING (auth.uid() = claimant_id OR auth.uid() = respondent_id OR auth.uid() = mediator_id);
CREATE POLICY "Users can create disputes" ON public.disputes FOR INSERT WITH CHECK (auth.uid() = claimant_id);
CREATE POLICY "Parties can update disputes" ON public.disputes FOR UPDATE USING (auth.uid() = claimant_id OR auth.uid() = respondent_id OR auth.uid() = mediator_id);

-- ====================================================================
-- 22. SELLER STATISTICS
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.seller_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  total_orders INTEGER DEFAULT 0,
  total_revenue DECIMAL(14,2) DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  response_time_hours DECIMAL(10,2) DEFAULT 0,
  order_completion_rate DECIMAL(5,2) DEFAULT 0,
  return_rate DECIMAL(5,2) DEFAULT 0,
  dispute_rate DECIMAL(5,2) DEFAULT 0,
  last_updated TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_seller_statistics_seller_id ON public.seller_statistics(seller_id);

ALTER TABLE public.seller_statistics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Seller statistics viewable by all" ON public.seller_statistics FOR SELECT USING (true);
CREATE POLICY "Sellers can view their statistics" ON public.seller_statistics FOR ALL USING (auth.uid() = seller_id);

-- ====================================================================
-- 23. ACTIVITY LOGS
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action_type VARCHAR(100) NOT NULL,
  entity_id UUID,
  entity_type VARCHAR(50),
  ip_address INET,
  user_agent TEXT,
  details JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX idx_activity_logs_action_type ON public.activity_logs(action_type);
CREATE INDEX idx_activity_logs_created_at ON public.activity_logs(created_at DESC);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their activity logs" ON public.activity_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can create activity logs" ON public.activity_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ====================================================================
-- UPDATE TRIGGERS FOR updated_at COLUMNS
-- ====================================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply triggers to tables with updated_at
DO $$
DECLARE
    tables_with_updated_at TEXT[] := ARRAY[
        'city_markets', 'subscription_boxes', 'seller_ratings', 'product_reviews',
        'inquiries', 'conversations', 'shopping_carts', 'cart_items', 'orders',
        'delivery_addresses', 'delivery_tracking', 'bulk_order_participants',
        'subscriptions', 'subscription_customizations', 'notification_preferences',
        'wishlists', 'market_trading_schedules', 'disputes', 'payments'
    ];
    tbl TEXT;
BEGIN
    FOREACH tbl IN ARRAY tables_with_updated_at LOOP
        EXECUTE format('
            DROP TRIGGER IF EXISTS update_%I_updated_at ON public.%I;
            CREATE TRIGGER update_%I_updated_at
            BEFORE UPDATE ON public.%I
            FOR EACH ROW
            EXECUTE FUNCTION public.update_updated_at_column();
        ', tbl, tbl, tbl, tbl);
    END LOOP;
END $$;