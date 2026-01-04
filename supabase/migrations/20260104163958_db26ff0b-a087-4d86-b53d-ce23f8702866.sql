-- Create imperfect_surplus_produce table for surplus/imperfect produce listings
CREATE TABLE public.imperfect_surplus_produce (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  quantity NUMERIC NOT NULL,
  unit TEXT NOT NULL DEFAULT 'kg',
  original_price NUMERIC,
  discounted_price NUMERIC NOT NULL,
  discount_percentage NUMERIC GENERATED ALWAYS AS (
    CASE WHEN original_price > 0 THEN ROUND((1 - (discounted_price / original_price)) * 100, 2) ELSE 0 END
  ) STORED,
  condition_notes TEXT,
  expiry_date DATE,
  pickup_location TEXT NOT NULL,
  county TEXT NOT NULL,
  images TEXT[],
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'sold', 'expired')),
  is_organic BOOLEAN DEFAULT false,
  reason_for_discount TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.imperfect_surplus_produce ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view available surplus produce" 
ON public.imperfect_surplus_produce 
FOR SELECT 
USING (status = 'available' OR seller_id = auth.uid());

CREATE POLICY "Users can create their own surplus listings" 
ON public.imperfect_surplus_produce 
FOR INSERT 
WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Users can update their own surplus listings" 
ON public.imperfect_surplus_produce 
FOR UPDATE 
USING (auth.uid() = seller_id);

CREATE POLICY "Users can delete their own surplus listings" 
ON public.imperfect_surplus_produce 
FOR DELETE 
USING (auth.uid() = seller_id);

-- Create trigger for updated_at
CREATE TRIGGER update_imperfect_surplus_produce_updated_at
BEFORE UPDATE ON public.imperfect_surplus_produce
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create farm_statistics table for dashboard analytics
CREATE TABLE IF NOT EXISTS public.farm_statistics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  monthly_revenue NUMERIC DEFAULT 0,
  total_area NUMERIC DEFAULT 0,
  average_yield NUMERIC DEFAULT 0,
  active_alerts INTEGER DEFAULT 0,
  total_crops INTEGER DEFAULT 0,
  total_livestock INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on farm_statistics
ALTER TABLE public.farm_statistics ENABLE ROW LEVEL SECURITY;

-- Create policies for farm_statistics
CREATE POLICY "Users can view their own farm statistics" 
ON public.farm_statistics 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own farm statistics" 
ON public.farm_statistics 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own farm statistics" 
ON public.farm_statistics 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create farmer_produce table for farmer's products
CREATE TABLE IF NOT EXISTS public.farmer_produce (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  farmer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  county TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  unit TEXT NOT NULL DEFAULT 'kg',
  quality_grade TEXT DEFAULT 'B',
  price_per_unit NUMERIC,
  available_from DATE,
  description TEXT,
  images TEXT[],
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'sold')),
  is_organic BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on farmer_produce
ALTER TABLE public.farmer_produce ENABLE ROW LEVEL SECURITY;

-- Create policies for farmer_produce
CREATE POLICY "Anyone can view available farmer produce" 
ON public.farmer_produce 
FOR SELECT 
USING (status = 'available' OR farmer_id = auth.uid());

CREATE POLICY "Farmers can create their own produce listings" 
ON public.farmer_produce 
FOR INSERT 
WITH CHECK (auth.uid() = farmer_id);

CREATE POLICY "Farmers can update their own produce listings" 
ON public.farmer_produce 
FOR UPDATE 
USING (auth.uid() = farmer_id);

CREATE POLICY "Farmers can delete their own produce listings" 
ON public.farmer_produce 
FOR DELETE 
USING (auth.uid() = farmer_id);

-- Create trigger for farmer_produce updated_at
CREATE TRIGGER update_farmer_produce_updated_at
BEFORE UPDATE ON public.farmer_produce
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();