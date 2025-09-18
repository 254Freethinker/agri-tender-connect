import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

export class FarmStatisticsServiceV2 {
  static async getFarmStatistics(userId: string): Promise<Database['public']['Tables']['farm_statistics']['Row'] | null> {
    const { data, error } = await supabase
      .from('farm_statistics')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  static async updateFarmStatistics(userId: string, stats: Database['public']['Tables']['farm_statistics']['Update']): Promise<Database['public']['Tables']['farm_statistics']['Row']> {
    const { data, error } = await supabase
      .from('farm_statistics')
      .update({
        ...stats,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getCropTracking(userId: string, filters?: {
    parcel_id?: string;
    crop_name?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<Database['public']['Tables']['crop_tracking']['Row'][]> {
    let query = supabase
      .from('crop_tracking')
      .select('*')
      .eq('user_id', userId);

    if (filters?.parcel_id) {
      query = query.eq('parcel_id', filters.parcel_id);
    }
    if (filters?.crop_name) {
      query = query.eq('crop_name', filters.crop_name);
    }
    if (filters?.start_date) {
      query = query.gte('planting_date', filters.start_date);
    }
    if (filters?.end_date) {
      query = query.lte('planting_date', filters.end_date);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  static async getBudget(userId: string, year: number): Promise<Database['public']['Tables']['farm_budgets']['Row'][]> {
    const { data, error } = await supabase
      .from('farm_budgets')
      .select('*')
      .eq('user_id', userId)
      .eq('year', year);

    if (error) throw error;
    return data || [];
  }

  static async addBudgetItem(data: Database['public']['Tables']['farm_budgets']['Insert']): Promise<Database['public']['Tables']['farm_budgets']['Row']> {
    const { data: result, error } = await supabase
      .from('farm_budgets')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  static async getTransactions(userId: string, filters?: {
    type?: 'income' | 'expense';
    start_date?: string;
    end_date?: string;
    category?: string;
  }): Promise<Database['public']['Tables']['financial_transactions']['Row'][]> {
    let query = supabase
      .from('financial_transactions')
      .select('*')
      .eq('user_id', userId);

    if (filters?.type) {
      query = query.eq('transaction_type', filters.type);
    }
    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    if (filters?.start_date) {
      query = query.gte('transaction_date', filters.start_date);
    }
    if (filters?.end_date) {
      query = query.lte('transaction_date', filters.end_date);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  static async addTransaction(data: Database['public']['Tables']['financial_transactions']['Insert']): Promise<Database['public']['Tables']['financial_transactions']['Row']> {
    const { data: result, error } = await supabase
      .from('financial_transactions')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return result;
  }

    static async getInventoryItems(userId: string, filters?: {
    category?: string;
    status?: 'normal' | 'warning' | 'critical';
  }): Promise<Database['public']['Tables']['inventory_items']['Row'][]> {
    let query = supabase
      .from('inventory_items')
      .select('*')
      .eq('user_id', userId);    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  static async addInventoryItem(data: Database['public']['Tables']['inventory_items']['Insert']): Promise<Database['public']['Tables']['inventory_items']['Row']> {
    const { data: result, error } = await supabase
      .from('inventory_items')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return result;
  }
}