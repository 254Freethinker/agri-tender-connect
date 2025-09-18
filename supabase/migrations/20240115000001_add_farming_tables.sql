-- Create resource_usage table
CREATE TABLE resource_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    resource_type TEXT NOT NULL,
    parcel_id UUID NOT NULL,
    usage_date TIMESTAMP WITH TIME ZONE NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit TEXT NOT NULL,
    cost_per_unit DECIMAL(10,2) NOT NULL,
    total_cost DECIMAL(10,2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create revenue_tracking table
CREATE TABLE revenue_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    source TEXT NOT NULL,
    subcategory TEXT,
    amount DECIMAL(12,2) NOT NULL,
    quantity DECIMAL(10,2),
    unit TEXT,
    price_per_unit DECIMAL(10,2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create farm_analytics table
CREATE TABLE farm_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    metric_name TEXT NOT NULL,
    metric_value DECIMAL(15,4) NOT NULL,
    unit TEXT NOT NULL,
    parcel_id UUID,
    sensor_id UUID,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for performance
CREATE INDEX idx_resource_usage_user_id ON resource_usage(user_id);
CREATE INDEX idx_resource_usage_parcel_id ON resource_usage(parcel_id);
CREATE INDEX idx_resource_usage_usage_date ON resource_usage(usage_date);

CREATE INDEX idx_revenue_tracking_user_id ON revenue_tracking(user_id);
CREATE INDEX idx_revenue_tracking_date ON revenue_tracking(date);
CREATE INDEX idx_revenue_tracking_source ON revenue_tracking(source);

CREATE INDEX idx_farm_analytics_user_id ON farm_analytics(user_id);
CREATE INDEX idx_farm_analytics_date ON farm_analytics(date);
CREATE INDEX idx_farm_analytics_metric_name ON farm_analytics(metric_name);
CREATE INDEX idx_farm_analytics_parcel_id ON farm_analytics(parcel_id);

-- Add triggers to update the updated_at timestamp
CREATE TRIGGER set_timestamp_resource_usage
    BEFORE UPDATE ON resource_usage
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_revenue_tracking
    BEFORE UPDATE ON revenue_tracking
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_farm_analytics
    BEFORE UPDATE ON farm_analytics
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();

-- Add RLS policies
ALTER TABLE resource_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE farm_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own resource usage"
    ON resource_usage FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own resource usage"
    ON resource_usage FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resource usage"
    ON resource_usage FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own revenue"
    ON revenue_tracking FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own revenue"
    ON revenue_tracking FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own revenue"
    ON revenue_tracking FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own analytics"
    ON farm_analytics FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analytics"
    ON farm_analytics FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analytics"
    ON farm_analytics FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);