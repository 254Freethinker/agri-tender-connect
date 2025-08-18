import { Partner, PartnerEvent } from '@/types/partner';

export const adaptPartnerFromApi = (data: any): Partner => {
  return {
    id: data.id,
    name: data.name || '',
    email: data.contact_email || '',
    phone: data.contact_phone || '',
    address: data.address || '',
    city: data.city || '',
    state: data.state || '',
    country: data.country || '',
    postalCode: data.postal_code || '',
    website: data.website || undefined,
    logoUrl: data.logo_url || undefined,
    description: data.description || '',
    services: data.services || [],
    createdAt: data.created_at || new Date().toISOString(),
    updatedAt: data.updated_at || new Date().toISOString(),
    isVerified: Boolean(data.is_verified),
    rating: data.rating,
    reviewCount: data.review_count,
    company_name: data.company_name,
    contact_email: data.contact_email,
    contact_phone: data.contact_phone,
    user_id: data.user_id
  };
};

export const adaptEventFromApi = (data: any): PartnerEvent => {
  return {
    id: data.id,
    title: data.title,
    description: data.description || '',
    startDate: data.event_date || new Date().toISOString(),
    endDate: data.event_date || new Date(Date.now() + 3600000).toISOString(),
    location: data.location || '',
    imageUrl: data.image_url,
    createdAt: data.created_at || new Date().toISOString(),
    updatedAt: data.updated_at || new Date().toISOString(),
    partnerId: data.partner_id || '',
    maxAttendees: data.max_attendees,
    attendeesCount: data.attendees_count,
    tags: data.tags || []
  };
};
