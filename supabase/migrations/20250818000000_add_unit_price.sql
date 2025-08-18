-- Add unit_price column to inventory_items table
ALTER TABLE "public"."inventory_items" 
ADD COLUMN IF NOT EXISTS "unit_price" numeric(10,2) DEFAULT 0.00;

-- Now we can add the computed total_value column
ALTER TABLE "public"."inventory_items" 
ADD COLUMN IF NOT EXISTS "total_value" numeric(10,2) GENERATED ALWAYS AS (quantity * unit_price) STORED;
