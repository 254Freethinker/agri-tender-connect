-- Create farm input related tables
CREATE TABLE IF NOT EXISTS public.farm_input_suppliers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  supplier_name TEXT NOT NULL,
  contact_phone TEXT,
  email TEXT,
  address TEXT,
  is_verified BOOLEAN DEFAULT false,
  rating DECIMAL(2,1) DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.farm_input_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  supplier_id UUID REFERENCES public.farm_input_suppliers(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  price_per_unit DECIMAL(10,2) NOT NULL,
  unit_type TEXT NOT NULL DEFAULT 'kg',
  stock_quantity INTEGER DEFAULT 0,
  minimum_order INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.farm_input_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  supplier_id UUID REFERENCES public.farm_input_suppliers(id),
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  delivery_address TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.farm_input_order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.farm_input_orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.farm_input_products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.farmer_contract_networks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_farmer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  network_name TEXT NOT NULL,
  description TEXT,
  member_count INTEGER DEFAULT 1,
  crop_focus TEXT,
  location TEXT,
  contract_terms TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.farm_input_suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farm_input_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farm_input_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farm_input_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmer_contract_networks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for farm_input_suppliers
CREATE POLICY "Suppliers are viewable by everyone" 
ON public.farm_input_suppliers 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create supplier profiles" 
ON public.farm_input_suppliers 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own supplier profiles" 
ON public.farm_input_suppliers 
FOR UPDATE 
USING (true);

-- Create RLS policies for farm_input_products  
CREATE POLICY "Products are viewable by everyone" 
ON public.farm_input_products 
FOR SELECT 
USING (true);

CREATE POLICY "Suppliers can create products" 
ON public.farm_input_products 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Suppliers can update their products" 
ON public.farm_input_products 
FOR UPDATE 
USING (true);

-- Create RLS policies for farm_input_orders
CREATE POLICY "Users can view their own orders" 
ON public.farm_input_orders 
FOR SELECT 
USING (auth.uid() = buyer_id);

CREATE POLICY "Users can create their own orders" 
ON public.farm_input_orders 
FOR INSERT 
WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Users can update their own orders" 
ON public.farm_input_orders 
FOR UPDATE 
USING (auth.uid() = buyer_id);

-- Create RLS policies for farm_input_order_items
CREATE POLICY "Users can view order items for their orders" 
ON public.farm_input_order_items 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.farm_input_orders 
  WHERE id = order_id AND buyer_id = auth.uid()
));

CREATE POLICY "Users can create order items for their orders" 
ON public.farm_input_order_items 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.farm_input_orders 
  WHERE id = order_id AND buyer_id = auth.uid()
));

-- Create RLS policies for farmer_contract_networks
CREATE POLICY "Networks are viewable by everyone" 
ON public.farmer_contract_networks 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own networks" 
ON public.farmer_contract_networks 
FOR INSERT 
WITH CHECK (auth.uid() = lead_farmer_id);

CREATE POLICY "Users can update their own networks" 
ON public.farmer_contract_networks 
FOR UPDATE 
USING (auth.uid() = lead_farmer_id);

CREATE POLICY "Users can delete their own networks" 
ON public.farmer_contract_networks 
FOR DELETE 
USING (auth.uid() = lead_farmer_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_farm_input_products_supplier_id ON public.farm_input_products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_farm_input_products_category ON public.farm_input_products(category);
CREATE INDEX IF NOT EXISTS idx_farm_input_orders_buyer_id ON public.farm_input_orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_farm_input_order_items_order_id ON public.farm_input_order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_farmer_contract_networks_lead_farmer_id ON public.farmer_contract_networks(lead_farmer_id);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_farm_input_suppliers_updated_at
    BEFORE UPDATE ON public.farm_input_suppliers
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_farm_input_products_updated_at
    BEFORE UPDATE ON public.farm_input_products
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_farm_input_orders_updated_at
    BEFORE UPDATE ON public.farm_input_orders
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_farmer_contract_networks_updated_at
    BEFORE UPDATE ON public.farmer_contract_networks
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();