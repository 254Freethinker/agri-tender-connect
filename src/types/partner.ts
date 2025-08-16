export type PartnerType = 'logistics' | 'financial' | 'input_supplier' | 'processor' | 'buyer' | 'extension_service' | 'government' | 'other';

export interface Partner {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  website?: string;
  logoUrl?: string;
  description?: string;
  services: string[];
  createdAt: string;
  updatedAt: string;
  isVerified: boolean;
  rating?: number;
  reviewCount?: number;
  company_name?: string;
  contact_email?: string;
  contact_phone?: string;
  user_id?: string;
}

export interface PartnerEvent {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  imageUrl?: string;
  maxAttendees?: number;
  attendeesCount?: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  partnerId: string;
}

export interface PartnerStats {
  totalEvents: number;
  upcomingEvents: number;
  pastEvents: number;
  totalPartners: number;
  activePartners: number;
  averageRating: number;
}

export type DashboardTab = 'overview' | 'events' | 'partners' | 'profile' | 'settings';

export interface PartnerProfileValues {
  companyName: string;
  contactEmail: string;
  contactPhone: string;
  description: string;
  website?: string;
  logoUrl?: string;
  services: string[];
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface PartnerEventFormValues {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  imageUrl?: string;
  maxAttendees?: number;
  tags?: string[];
}

export interface PartnershipRequest {
  id: string;
  partner_id: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  requested_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  notes?: string;
  terms_accepted: boolean;
}

export interface PartnerService {
  id: string;
  partner_id: string;
  name: string;
  description: string;
  service_type: string;
  pricing_model: 'fixed' | 'percentage' | 'subscription' | 'custom';
  pricing_details: Record<string, any>;
  coverage_areas?: string[];
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface PartnerReview {
  id: string;
  partner_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
  response?: string;
  response_date?: string;
}
