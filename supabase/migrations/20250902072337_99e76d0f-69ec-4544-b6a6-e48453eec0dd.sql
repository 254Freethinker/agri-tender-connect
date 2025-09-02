-- Enable RLS and create policies for all tables

-- Fix the search path function
DROP FUNCTION IF EXISTS public.update_updated_at_column();
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.city_market_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_auctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auction_bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_rescue_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_rescue_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_rescue_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.export_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.export_documentation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmer_consolidations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_input_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_order_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.f2c_subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.f2c_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.f2c_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_farming ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farm_yields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farm_budget ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_impact ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.input_suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.input_products ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- City market products policies
CREATE POLICY "Anyone can view products" ON public.city_market_products FOR SELECT USING (true);
CREATE POLICY "Agents can insert products" ON public.city_market_products FOR INSERT WITH CHECK (auth.uid() = agent_id);
CREATE POLICY "Agents can update own products" ON public.city_market_products FOR UPDATE USING (auth.uid() = agent_id);
CREATE POLICY "Agents can delete own products" ON public.city_market_products FOR DELETE USING (auth.uid() = agent_id);

-- Product auctions policies
CREATE POLICY "Anyone can view auctions" ON public.product_auctions FOR SELECT USING (true);
CREATE POLICY "Agents can create auctions" ON public.product_auctions FOR INSERT WITH CHECK (auth.uid() = agent_id);
CREATE POLICY "Agents can update own auctions" ON public.product_auctions FOR UPDATE USING (auth.uid() = agent_id);
CREATE POLICY "Agents can delete own auctions" ON public.product_auctions FOR DELETE USING (auth.uid() = agent_id);

-- Auction bids policies
CREATE POLICY "Anyone can view bids" ON public.auction_bids FOR SELECT USING (true);
CREATE POLICY "Users can place bids" ON public.auction_bids FOR INSERT WITH CHECK (auth.uid() = bidder_id);

-- Food rescue recipients policies (public info)
CREATE POLICY "Anyone can view recipients" ON public.food_rescue_recipients FOR SELECT USING (true);
CREATE POLICY "Admins can manage recipients" ON public.food_rescue_recipients FOR ALL USING (true);

-- Food rescue listings policies
CREATE POLICY "Anyone can view listings" ON public.food_rescue_listings FOR SELECT USING (true);
CREATE POLICY "Users can create listings" ON public.food_rescue_listings FOR INSERT WITH CHECK (auth.uid() = donor_id);
CREATE POLICY "Users can update own listings" ON public.food_rescue_listings FOR UPDATE USING (auth.uid() = donor_id);
CREATE POLICY "Users can delete own listings" ON public.food_rescue_listings FOR DELETE USING (auth.uid() = donor_id);

-- Food rescue matches policies
CREATE POLICY "Users can view relevant matches" ON public.food_rescue_matches FOR SELECT USING (
  auth.uid() IN (
    SELECT donor_id FROM public.food_rescue_listings WHERE id = listing_id
  )
);
CREATE POLICY "Recipients can create matches" ON public.food_rescue_matches FOR INSERT WITH CHECK (true);
CREATE POLICY "Participants can update matches" ON public.food_rescue_matches FOR UPDATE USING (
  auth.uid() IN (
    SELECT donor_id FROM public.food_rescue_listings WHERE id = listing_id
  )
);

-- Export opportunities policies
CREATE POLICY "Anyone can view open opportunities" ON public.export_opportunities FOR SELECT USING (status = 'open' OR created_by = auth.uid());
CREATE POLICY "Users can create opportunities" ON public.export_opportunities FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update own opportunities" ON public.export_opportunities FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can delete own opportunities" ON public.export_opportunities FOR DELETE USING (auth.uid() = created_by);

-- Export documentation policies
CREATE POLICY "Users can view own docs" ON public.export_documentation FOR SELECT USING (auth.uid() = uploaded_by);
CREATE POLICY "Users can upload docs" ON public.export_documentation FOR INSERT WITH CHECK (auth.uid() = uploaded_by);
CREATE POLICY "Users can update own docs" ON public.export_documentation FOR UPDATE USING (auth.uid() = uploaded_by);
CREATE POLICY "Users can delete own docs" ON public.export_documentation FOR DELETE USING (auth.uid() = uploaded_by);

-- Farmer consolidations policies
CREATE POLICY "Users can view own consolidations" ON public.farmer_consolidations FOR SELECT USING (auth.uid() = consolidator_id);
CREATE POLICY "Users can create consolidations" ON public.farmer_consolidations FOR INSERT WITH CHECK (auth.uid() = consolidator_id);
CREATE POLICY "Users can update own consolidations" ON public.farmer_consolidations FOR UPDATE USING (auth.uid() = consolidator_id);
CREATE POLICY "Users can delete own consolidations" ON public.farmer_consolidations FOR DELETE USING (auth.uid() = consolidator_id);

-- Group input orders policies
CREATE POLICY "Anyone can view open orders" ON public.group_input_orders FOR SELECT USING (status = 'open' OR coordinator_id = auth.uid());
CREATE POLICY "Users can create orders" ON public.group_input_orders FOR INSERT WITH CHECK (auth.uid() = coordinator_id);
CREATE POLICY "Coordinators can update orders" ON public.group_input_orders FOR UPDATE USING (auth.uid() = coordinator_id);
CREATE POLICY "Coordinators can delete orders" ON public.group_input_orders FOR DELETE USING (auth.uid() = coordinator_id);

-- Group order participants policies
CREATE POLICY "Users can view participants in relevant orders" ON public.group_order_participants FOR SELECT USING (
  auth.uid() = farmer_id OR 
  auth.uid() IN (SELECT coordinator_id FROM public.group_input_orders WHERE id = order_id)
);
CREATE POLICY "Users can join orders" ON public.group_order_participants FOR INSERT WITH CHECK (auth.uid() = farmer_id);
CREATE POLICY "Users can update own participation" ON public.group_order_participants FOR UPDATE USING (auth.uid() = farmer_id);
CREATE POLICY "Users can leave orders" ON public.group_order_participants FOR DELETE USING (auth.uid() = farmer_id);

-- F2C subscription plans policies (public)
CREATE POLICY "Anyone can view plans" ON public.f2c_subscription_plans FOR SELECT USING (true);
CREATE POLICY "Admins can manage plans" ON public.f2c_subscription_plans FOR ALL USING (true);

-- F2C subscriptions policies
CREATE POLICY "Users can view own subscriptions" ON public.f2c_subscriptions FOR SELECT USING (auth.uid() = consumer_id);
CREATE POLICY "Users can create subscriptions" ON public.f2c_subscriptions FOR INSERT WITH CHECK (auth.uid() = consumer_id);
CREATE POLICY "Users can update own subscriptions" ON public.f2c_subscriptions FOR UPDATE USING (auth.uid() = consumer_id);
CREATE POLICY "Users can cancel own subscriptions" ON public.f2c_subscriptions FOR DELETE USING (auth.uid() = consumer_id);

-- F2C deliveries policies
CREATE POLICY "Users can view relevant deliveries" ON public.f2c_deliveries FOR SELECT USING (
  auth.uid() IN (
    SELECT consumer_id FROM public.f2c_subscriptions WHERE id = subscription_id
  ) OR auth.uid() = farmer_id
);
CREATE POLICY "Farmers can update deliveries" ON public.f2c_deliveries FOR UPDATE USING (auth.uid() = farmer_id);
CREATE POLICY "System can create deliveries" ON public.f2c_deliveries FOR INSERT WITH CHECK (true);

-- Service providers policies
CREATE POLICY "Anyone can view verified providers" ON public.service_providers FOR SELECT USING (verification_status = 'verified');
CREATE POLICY "Users can create provider profiles" ON public.service_providers FOR INSERT WITH CHECK (auth.uid() = provider_id);
CREATE POLICY "Providers can update own profiles" ON public.service_providers FOR UPDATE USING (auth.uid() = provider_id);
CREATE POLICY "Providers can delete own profiles" ON public.service_providers FOR DELETE USING (auth.uid() = provider_id);

-- Service bookings policies
CREATE POLICY "Users can view own bookings" ON public.service_bookings FOR SELECT USING (
  auth.uid() = client_id OR 
  auth.uid() IN (SELECT provider_id FROM public.service_providers WHERE id = service_id)
);
CREATE POLICY "Users can create bookings" ON public.service_bookings FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Participants can update bookings" ON public.service_bookings FOR UPDATE USING (
  auth.uid() = client_id OR 
  auth.uid() IN (SELECT provider_id FROM public.service_providers WHERE id = service_id)
);

-- Contract farming policies
CREATE POLICY "Users can view relevant contracts" ON public.contract_farming FOR SELECT USING (
  auth.uid() = buyer_id OR auth.uid() = farmer_id OR status = 'open'
);
CREATE POLICY "Buyers can create contracts" ON public.contract_farming FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Participants can update contracts" ON public.contract_farming FOR UPDATE USING (
  auth.uid() = buyer_id OR auth.uid() = farmer_id
);

-- Contract documents policies
CREATE POLICY "Contract participants can view docs" ON public.contract_documents FOR SELECT USING (
  auth.uid() = uploaded_by OR
  auth.uid() IN (
    SELECT buyer_id FROM public.contract_farming WHERE id = contract_id
    UNION
    SELECT farmer_id FROM public.contract_farming WHERE id = contract_id
  )
);
CREATE POLICY "Users can upload contract docs" ON public.contract_documents FOR INSERT WITH CHECK (auth.uid() = uploaded_by);

-- Contract reviews policies
CREATE POLICY "Anyone can view reviews" ON public.contract_reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON public.contract_reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Farm statistics policies (farm_id is user_id for farm owners)
CREATE POLICY "Farm owners can view own data" ON public.farm_yields FOR SELECT USING (auth.uid()::text = farm_id);
CREATE POLICY "Farm owners can manage own data" ON public.farm_yields FOR ALL USING (auth.uid()::text = farm_id);

CREATE POLICY "Farm owners can view own resources" ON public.resource_usage FOR SELECT USING (auth.uid()::text = farm_id);
CREATE POLICY "Farm owners can manage own resources" ON public.resource_usage FOR ALL USING (auth.uid()::text = farm_id);

CREATE POLICY "Farm owners can view own budget" ON public.farm_budget FOR SELECT USING (auth.uid()::text = farm_id);
CREATE POLICY "Farm owners can manage own budget" ON public.farm_budget FOR ALL USING (auth.uid()::text = farm_id);

CREATE POLICY "Farm owners can view own weather data" ON public.weather_impact FOR SELECT USING (auth.uid()::text = farm_id);
CREATE POLICY "Farm owners can manage own weather data" ON public.weather_impact FOR ALL USING (auth.uid()::text = farm_id);

-- Input suppliers policies
CREATE POLICY "Anyone can view verified suppliers" ON public.input_suppliers FOR SELECT USING (verification_status = 'verified');
CREATE POLICY "Users can create supplier profiles" ON public.input_suppliers FOR INSERT WITH CHECK (auth.uid() = supplier_id);
CREATE POLICY "Suppliers can update own profiles" ON public.input_suppliers FOR UPDATE USING (auth.uid() = supplier_id);

-- Input products policies
CREATE POLICY "Anyone can view products from verified suppliers" ON public.input_products FOR SELECT USING (
  supplier_id IN (SELECT id FROM public.input_suppliers WHERE verification_status = 'verified')
);
CREATE POLICY "Suppliers can manage own products" ON public.input_products FOR ALL USING (
  auth.uid() IN (SELECT supplier_id FROM public.input_suppliers WHERE id = supplier_id)
);

-- Create user profile trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name'),
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();