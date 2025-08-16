import { supabase } from '@/integrations/supabase/client';
import { Partner, PartnerReview, PartnerService, PartnershipRequest } from '@/types/partner';

// Basic Partner CRUD
export async function createPartner(partner: Omit<Partner, 'id' | 'created_at' | 'updated_at'>) {
  return supabase.from('partners').insert([partner]).select().single();
}

export async function getPartner(id: string) {
  return supabase.from('partners').select('*').eq('id', id).single();
}

export async function getMyPartner() {
  const { data: { user } } = await supabase.auth.getUser();
  return supabase.from('partners').select('*').eq('user_id', user?.id).single();
}

export async function updatePartner(id: string, updates: Partial<Partner>) {
  return supabase.from('partners').update(updates).eq('id', id).select().single();
}

// Partner Services
export async function createPartnerService(service: Omit<PartnerService, 'id' | 'created_at' | 'updated_at'>) {
  return supabase.from('partner_services').insert([service]).select().single();
}

export async function getPartnerServices(partnerId: string) {
  return supabase.from('partner_services').select('*').eq('partner_id', partnerId).eq('is_available', true);
}

// Partnership Management
export async function requestPartnership(partnership: Omit<PartnershipRequest, 'id' | 'requested_at' | 'status'>) {
  const request = {
    ...partnership,
    status: 'pending' as const,
    requested_at: new Date().toISOString(),
    terms_accepted: true,
  };
  return supabase.from('partnership_requests').insert([request]).select().single();
}

export async function getPartnershipRequests(partnerId: string) {
  return supabase
    .from('partnership_requests')
    .select('*, partners(*)')
    .or(`partner_id.eq.${partnerId},requester_id.eq.${partnerId}`);
}

// Reviews & Ratings
export async function createPartnerReview(review: Omit<PartnerReview, 'id' | 'created_at' | 'updated_at'>) {
  return supabase.from('partner_reviews').insert([review]).select().single();
}

export async function getPartnerReviews(partnerId: string) {
  return supabase
    .from('partner_reviews')
    .select('*, user:users(name, avatar_url)')
    .eq('partner_id', partnerId)
    .order('created_at', { ascending: false });
}

// Supply Chain Integration
export async function getSupplyChainPartners(filters: {
  partnerTypes?: string[];
  services?: string[];
  location?: string;
}) {
  let query = supabase.from('partners').select('*, partner_services(*)').eq('is_verified', true);

  if (filters.partnerTypes?.length) {
    query = query.in('type', filters.partnerTypes);
  }
  
  if (filters.services?.length) {
    query = query.contains('services', filters.services);
  }
  
  if (filters.location) {
    query = query.ilike('coverage_areas', `%${filters.location}%`);
  }

  return query;
}

// Partner Events
export async function createPartnerEvent(event: any) {
  return supabase.from('partner_events').insert([event]).select().single();
}

export async function getPartnerEvents(partnerId?: string) {
  const query = supabase.from('partner_events').select('*');
  return partnerId ? query.eq('partner_id', partnerId) : query;
}

export async function updatePartnerEvent(id: string, updates: any) {
  return supabase.from('partner_events').update(updates).eq('id', id).select().single();
}

// Analytics & Reporting
export async function getPartnerAnalytics(partnerId: string, period: 'week' | 'month' | 'year' = 'month') {
  return supabase.rpc('get_partner_analytics', { partner_id: partnerId, period });
}

export async function getValueChainInsights(partnerId: string) {
  return supabase.rpc('get_value_chain_insights', { partner_id: partnerId });
}
