// Database Types
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      farm_statistics: {
        Row: {
          id: string;
          user_id: string;
          monthly_revenue: number;
          total_area: number;
          average_yield: number;
          active_alerts: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          monthly_revenue: number;
          total_area: number;
          average_yield: number;
          active_alerts: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          monthly_revenue?: number;
          total_area?: number;
          average_yield?: number;
          active_alerts?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      crop_tracking: {
        Row: {
          id: string;
          user_id: string;
          parcel_id: string;
          crop_name: string;
          variety?: string;
          planting_date: string;
          harvest_date?: string;
          area_planted: number;
          expected_yield: number;
          actual_yield?: number;
          yield_per_hectare?: number;
          yield_quality?: string;
          notes?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          parcel_id: string;
          crop_name: string;
          variety?: string;
          planting_date: string;
          harvest_date?: string;
          area_planted: number;
          expected_yield: number;
          actual_yield?: number;
          yield_per_hectare?: number;
          yield_quality?: string;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          parcel_id?: string;
          crop_name?: string;
          variety?: string;
          planting_date?: string;
          harvest_date?: string;
          area_planted?: number;
          expected_yield?: number;
          actual_yield?: number;
          yield_per_hectare?: number;
          yield_quality?: string;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      crop_tracking: {
        Row: {
          id: string;
          user_id: string;
          parcel_id: string;
          crop_name: string;
          variety?: string;
          planting_date: string;
          expected_harvest_date?: string;
          actual_harvest_date?: string;
          planted_area: number;
          seeds_used?: number;
          fertilizer_applied?: Json;
          pesticides_applied?: Json;
          irrigation_schedule?: Json;
          growth_stage: string;
          estimated_yield?: number;
          actual_yield?: number;
          quality_grade?: string;
          notes?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          parcel_id: string;
          crop_name: string;
          variety?: string;
          planting_date: string;
          expected_harvest_date?: string;
          actual_harvest_date?: string;
          planted_area: number;
          seeds_used?: number;
          fertilizer_applied?: Json;
          pesticides_applied?: Json;
          irrigation_schedule?: Json;
          growth_stage: string;
          estimated_yield?: number;
          actual_yield?: number;
          quality_grade?: string;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          parcel_id?: string;
          crop_name?: string;
          variety?: string;
          planting_date?: string;
          expected_harvest_date?: string;
          actual_harvest_date?: string;
          planted_area?: number;
          seeds_used?: number;
          fertilizer_applied?: Json;
          pesticides_applied?: Json;
          irrigation_schedule?: Json;
          growth_stage?: string;
          estimated_yield?: number;
          actual_yield?: number;
          quality_grade?: string;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      farm_budgets: {
        Row: {
          id: string;
          user_id: string;
          year: number;
          category: string;
          subcategory?: string;
          planned_amount: number;
          actual_amount?: number;
          notes?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          year: number;
          category: string;
          subcategory?: string;
          planned_amount: number;
          actual_amount?: number;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          year?: number;
          category?: string;
          subcategory?: string;
          planned_amount?: number;
          actual_amount?: number;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      financial_transactions: {
        Row: {
          id: string;
          user_id: string;
          transaction_type: 'income' | 'expense';
          amount: number;
          description: string;
          category: string;
          transaction_date: string;
          payment_method?: string;
          receipt_url?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          transaction_type: 'income' | 'expense';
          amount: number;
          description: string;
          category: string;
          transaction_date: string;
          payment_method?: string;
          receipt_url?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          transaction_type?: 'income' | 'expense';
          amount?: number;
          description?: string;
          category?: string;
          transaction_date?: string;
          payment_method?: string;
          receipt_url?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      inventory_items: {
        Row: {
          id: string;
          user_id: string;
          item_name: string;
          category: string;
          quantity: number;
          unit: string;
          unit_price: number;
          total_value: number;
          minimum_stock: number;
          supplier_name?: string;
          purchase_date?: string;
          expiry_date?: string;
          status: 'normal' | 'warning' | 'critical';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          item_name: string;
          category: string;
          quantity: number;
          unit: string;
          unit_price: number;
          minimum_stock: number;
          supplier_name?: string;
          purchase_date?: string;
          expiry_date?: string;
          status?: 'normal' | 'warning' | 'critical';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          item_name?: string;
          category?: string;
          quantity?: number;
          unit?: string;
          unit_price?: number;
          minimum_stock?: number;
          supplier_name?: string;
          purchase_date?: string;
          expiry_date?: string;
          status?: 'normal' | 'warning' | 'critical';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

// Helper type to get Row type from a table
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];