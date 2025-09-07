-- Enable RLS on all tables and add comprehensive policies
ALTER TABLE public.auction_bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.city_market_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_farming ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.export_documentation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.export_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.f2c_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.f2c_subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.f2c_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farm_budget ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farm_yields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmer_consolidations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_rescue_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_rescue_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_rescue_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_input_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_order_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.input_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.input_suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_auctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_impact ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Food rescue policies (public access for humanitarian purposes)
CREATE POLICY "Food rescue listings viewable by all" ON food_rescue_listings FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create listings" ON food_rescue_listings FOR INSERT WITH CHECK (auth.uid() = donor_id);
CREATE POLICY "Donors can update their listings" ON food_rescue_listings FOR UPDATE USING (auth.uid() = donor_id);

CREATE POLICY "Food rescue matches viewable by all" ON food_rescue_matches FOR SELECT USING (true);
CREATE POLICY "Recipients can create matches" ON food_rescue_matches FOR INSERT WITH CHECK (auth.uid() = recipient_id);
CREATE POLICY "Recipients can update their matches" ON food_rescue_matches FOR UPDATE USING (auth.uid() = recipient_id);

CREATE POLICY "Food rescue recipients viewable by all" ON food_rescue_recipients FOR SELECT USING (true);
CREATE POLICY "Anyone can register as recipient" ON food_rescue_recipients FOR INSERT WITH CHECK (true);

-- Market products (agent-based)
CREATE POLICY "City market products viewable by all" ON city_market_products FOR SELECT USING (true);
CREATE POLICY "Agents can manage their products" ON city_market_products FOR ALL USING (auth.uid() = agent_id);

-- Auction policies
CREATE POLICY "Product auctions viewable by all" ON product_auctions FOR SELECT USING (true);
CREATE POLICY "Agents can create auctions" ON product_auctions FOR INSERT WITH CHECK (auth.uid() = agent_id);
CREATE POLICY "Agents can manage their auctions" ON product_auctions FOR UPDATE USING (auth.uid() = agent_id);

CREATE POLICY "Auction bids viewable by all" ON auction_bids FOR SELECT USING (true);
CREATE POLICY "Authenticated users can bid" ON auction_bids FOR INSERT WITH CHECK (auth.uid() = bidder_id);

-- Contract farming
CREATE POLICY "Contract farming viewable by all" ON contract_farming FOR SELECT USING (true);
CREATE POLICY "Buyers can create contracts" ON contract_farming FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Parties can update contracts" ON contract_farming FOR UPDATE USING (auth.uid() = buyer_id OR auth.uid() = farmer_id);

-- Group orders
CREATE POLICY "Group orders viewable by all" ON group_input_orders FOR SELECT USING (true);
CREATE POLICY "Coordinators can create orders" ON group_input_orders FOR INSERT WITH CHECK (auth.uid() = coordinator_id);
CREATE POLICY "Coordinators can manage orders" ON group_input_orders FOR UPDATE USING (auth.uid() = coordinator_id);

CREATE POLICY "Order participants viewable by all" ON group_order_participants FOR SELECT USING (true);
CREATE POLICY "Farmers can join orders" ON group_order_participants FOR INSERT WITH CHECK (auth.uid() = farmer_id);
CREATE POLICY "Farmers can update participation" ON group_order_participants FOR UPDATE USING (auth.uid() = farmer_id);

-- Farm data (user-specific)
CREATE POLICY "Users can manage their farm budget" ON farm_budget FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.id = farm_budget.farm_id)
);

CREATE POLICY "Users can manage their farm yields" ON farm_yields FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.id = farm_yields.farm_id)
);

CREATE POLICY "Users can manage their resource usage" ON resource_usage FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.id = resource_usage.farm_id)
);

CREATE POLICY "Users can manage their weather impact" ON weather_impact FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.id = weather_impact.farm_id)
);

-- Service providers and bookings
CREATE POLICY "Service providers viewable by all" ON service_providers FOR SELECT USING (true);
CREATE POLICY "Providers can manage their services" ON service_providers FOR ALL USING (auth.uid() = provider_id);

CREATE POLICY "Service bookings viewable by participants" ON service_bookings FOR SELECT USING (
  auth.uid() = client_id OR 
  EXISTS (SELECT 1 FROM service_providers WHERE service_providers.id = service_bookings.service_id AND service_providers.provider_id = auth.uid())
);
CREATE POLICY "Clients can create bookings" ON service_bookings FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Participants can update bookings" ON service_bookings FOR UPDATE USING (
  auth.uid() = client_id OR 
  EXISTS (SELECT 1 FROM service_providers WHERE service_providers.id = service_bookings.service_id AND service_providers.provider_id = auth.uid())
);

-- Input marketplace
CREATE POLICY "Input products viewable by all" ON input_products FOR SELECT USING (true);
CREATE POLICY "Suppliers can manage their products" ON input_products FOR ALL USING (auth.uid() = supplier_id);

CREATE POLICY "Input suppliers viewable by all" ON input_suppliers FOR SELECT USING (true);
CREATE POLICY "Suppliers can manage their profile" ON input_suppliers FOR ALL USING (auth.uid() = supplier_id);

-- Export opportunities
CREATE POLICY "Export opportunities viewable by all" ON export_opportunities FOR SELECT USING (true);
CREATE POLICY "Creators can manage their opportunities" ON export_opportunities FOR ALL USING (auth.uid() = created_by);

CREATE POLICY "Export documentation viewable by opportunity participants" ON export_documentation FOR SELECT USING (
  EXISTS (SELECT 1 FROM export_opportunities WHERE export_opportunities.id = export_documentation.opportunity_id AND export_opportunities.created_by = auth.uid()) OR
  auth.uid() = uploaded_by
);
CREATE POLICY "Users can upload documentation" ON export_documentation FOR INSERT WITH CHECK (auth.uid() = uploaded_by);

-- F2C subscriptions
CREATE POLICY "Subscription plans viewable by all" ON f2c_subscription_plans FOR SELECT USING (true);

CREATE POLICY "Users can manage their subscriptions" ON f2c_subscriptions FOR ALL USING (auth.uid() = consumer_id);

CREATE POLICY "Deliveries viewable by participants" ON f2c_deliveries FOR SELECT USING (
  EXISTS (SELECT 1 FROM f2c_subscriptions WHERE f2c_subscriptions.id = f2c_deliveries.subscription_id AND f2c_subscriptions.consumer_id = auth.uid()) OR
  auth.uid() = farmer_id
);
CREATE POLICY "Farmers can manage deliveries" ON f2c_deliveries FOR ALL USING (auth.uid() = farmer_id);

-- Farmer consolidations and contract documents
CREATE POLICY "Farmer consolidations viewable by all" ON farmer_consolidations FOR SELECT USING (true);
CREATE POLICY "Consolidators can manage consolidations" ON farmer_consolidations FOR ALL USING (auth.uid() = consolidator_id);

CREATE POLICY "Contract documents viewable by contract parties" ON contract_documents FOR SELECT USING (
  EXISTS (SELECT 1 FROM contract_farming WHERE contract_farming.id = contract_documents.contract_id AND (contract_farming.buyer_id = auth.uid() OR contract_farming.farmer_id = auth.uid()))
);
CREATE POLICY "Contract parties can upload documents" ON contract_documents FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM contract_farming WHERE contract_farming.id = contract_documents.contract_id AND (contract_farming.buyer_id = auth.uid() OR contract_farming.farmer_id = auth.uid())) AND
  auth.uid() = uploaded_by
);

CREATE POLICY "Contract reviews viewable by all" ON contract_reviews FOR SELECT USING (true);
CREATE POLICY "Contract parties can review" ON contract_reviews FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM contract_farming WHERE contract_farming.id = contract_reviews.contract_id AND (contract_farming.buyer_id = auth.uid() OR contract_farming.farmer_id = auth.uid())) AND
  auth.uid() = reviewer_id
);