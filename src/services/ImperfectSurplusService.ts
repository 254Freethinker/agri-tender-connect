// ImperfectSurplusService: Handles CRUD for imperfect surplus produce
import { supabase } from '@/integrations/supabase/client';

export interface ImperfectSurplusProduce {
  id?: string;
  seller_id: string;
  product_name: string;
  category: string;
  description?: string | null;
  quantity: number;
  unit: string;
  original_price?: number | null;
  discounted_price: number;
  discount_percentage?: number | null;
  condition_notes?: string | null;
  expiry_date?: string | null;
  pickup_location: string;
  county: string;
  images?: string[] | null;
  status?: string;
  is_organic?: boolean;
  reason_for_discount?: string | null;
  created_at?: string;
  updated_at?: string;
}

export async function createImperfectSurplusProduce(produce: Omit<ImperfectSurplusProduce, 'id' | 'discount_percentage' | 'created_at' | 'updated_at'>) {
  return supabase.from('imperfect_surplus_produce').insert(produce).select();
}

export async function getImperfectSurplusProduce(filter: Partial<ImperfectSurplusProduce> = {}) {
  let query = supabase.from('imperfect_surplus_produce').select('*');
  
  if (Object.keys(filter).length > 0) {
    query = query.match(filter);
  }
  
  return query.order('created_at', { ascending: false });
}

export async function getAvailableImperfectSurplusProduce() {
  return supabase
    .from('imperfect_surplus_produce')
    .select('*')
    .eq('status', 'available')
    .order('created_at', { ascending: false });
}

export async function getUserImperfectSurplusProduce(userId: string) {
  return supabase
    .from('imperfect_surplus_produce')
    .select('*')
    .eq('seller_id', userId)
    .order('created_at', { ascending: false });
}

export async function updateImperfectSurplusProduce(id: string, updates: Partial<ImperfectSurplusProduce>) {
  return supabase.from('imperfect_surplus_produce').update(updates).eq('id', id).select();
}

export async function deleteImperfectSurplusProduce(id: string) {
  return supabase.from('imperfect_surplus_produce').delete().eq('id', id);
}

export async function updateImperfectSurplusStatus(id: string, status: 'available' | 'reserved' | 'sold' | 'expired') {
  return supabase.from('imperfect_surplus_produce').update({ status }).eq('id', id).select();
}
