-- Create organization verification tables for schools, CBOs, and hospitals
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  org_name TEXT NOT NULL,
  org_type TEXT NOT NULL CHECK (org_type IN ('school', 'cbo', 'hospital', 'ngo', 'charity')),
  registration_number TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  physical_address TEXT NOT NULL,
  county TEXT NOT NULL,
  description TEXT,
  website TEXT,
  
  -- Verification fields
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID REFERENCES auth.users(id),
  verification_documents JSONB DEFAULT '[]'::jsonb,
  rejection_reason TEXT,
  
  -- Capacity info
  beneficiary_count INTEGER,
  service_area TEXT[],
  
  -- Trust score
  trust_score NUMERIC DEFAULT 0.0,
  completed_rescues INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create post reports/flags table
CREATE TABLE IF NOT EXISTS public.post_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL,
  reporter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  report_type TEXT NOT NULL CHECK (report_type IN ('spam', 'inappropriate', 'scam', 'misinformation', 'harassment', 'other')),
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'action_taken', 'dismissed')),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  action_taken TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create contract documents table
CREATE TABLE IF NOT EXISTS public.contract_documents_v2 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID REFERENCES contract_farming(id) ON DELETE CASCADE NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  document_name TEXT NOT NULL,
  document_url TEXT NOT NULL,
  document_type TEXT NOT NULL CHECK (document_type IN ('contract_agreement', 'land_certificate', 'id_document', 'quality_cert', 'insurance', 'payment_receipt', 'delivery_note', 'google_drive_link', 'other')),
  file_size INTEGER,
  is_verified BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create contract milestones for tracking
CREATE TABLE IF NOT EXISTS public.contract_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID REFERENCES contract_farming(id) ON DELETE CASCADE NOT NULL,
  milestone_name TEXT NOT NULL,
  description TEXT,
  due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'delayed', 'cancelled')),
  completed_at TIMESTAMP WITH TIME ZONE,
  payment_amount NUMERIC,
  payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'overdue')),
  verified_by TEXT, -- farmer or buyer
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create contract disputes table
CREATE TABLE IF NOT EXISTS public.contract_disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID REFERENCES contract_farming(id) ON DELETE CASCADE NOT NULL,
  raised_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  dispute_type TEXT NOT NULL CHECK (dispute_type IN ('payment', 'quality', 'quantity', 'delivery', 'breach', 'other')),
  description TEXT NOT NULL,
  evidence_urls TEXT[],
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'under_review', 'mediation', 'resolved', 'escalated')),
  resolution TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create contract insurance/escrow table for payment protection
CREATE TABLE IF NOT EXISTS public.contract_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID REFERENCES contract_farming(id) ON DELETE CASCADE NOT NULL,
  milestone_id UUID REFERENCES contract_milestones(id),
  amount NUMERIC NOT NULL,
  payment_type TEXT NOT NULL CHECK (payment_type IN ('deposit', 'milestone', 'final', 'penalty', 'bonus')),
  payment_method TEXT CHECK (payment_method IN ('mpesa', 'bank_transfer', 'escrow', 'cash')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'held_in_escrow', 'released', 'refunded', 'disputed')),
  paid_by UUID REFERENCES auth.users(id),
  paid_to UUID REFERENCES auth.users(id),
  transaction_ref TEXT,
  paid_at TIMESTAMP WITH TIME ZONE,
  released_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_documents_v2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for organizations
CREATE POLICY "Organizations viewable by all" ON public.organizations FOR SELECT USING (true);
CREATE POLICY "Users can create their org" ON public.organizations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their org" ON public.organizations FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for post reports
CREATE POLICY "Reports viewable by reporter and admins" ON public.post_reports FOR SELECT 
  USING (auth.uid() = reporter_id OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can report posts" ON public.post_reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);

-- RLS Policies for contract documents
CREATE POLICY "Contract docs viewable by parties" ON public.contract_documents_v2 FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM contract_farming 
      WHERE id = contract_documents_v2.contract_id 
      AND (buyer_id = auth.uid() OR farmer_id = auth.uid())
    )
  );
CREATE POLICY "Contract parties can upload docs" ON public.contract_documents_v2 FOR INSERT 
  WITH CHECK (
    auth.uid() = uploaded_by AND EXISTS (
      SELECT 1 FROM contract_farming 
      WHERE id = contract_documents_v2.contract_id 
      AND (buyer_id = auth.uid() OR farmer_id = auth.uid())
    )
  );

-- RLS Policies for milestones
CREATE POLICY "Milestones viewable by parties" ON public.contract_milestones FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM contract_farming 
      WHERE id = contract_milestones.contract_id 
      AND (buyer_id = auth.uid() OR farmer_id = auth.uid())
    )
  );
CREATE POLICY "Contract parties can manage milestones" ON public.contract_milestones FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM contract_farming 
      WHERE id = contract_milestones.contract_id 
      AND (buyer_id = auth.uid() OR farmer_id = auth.uid())
    )
  );

-- RLS Policies for disputes
CREATE POLICY "Disputes viewable by parties" ON public.contract_disputes FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM contract_farming 
      WHERE id = contract_disputes.contract_id 
      AND (buyer_id = auth.uid() OR farmer_id = auth.uid())
    )
  );
CREATE POLICY "Contract parties can raise disputes" ON public.contract_disputes FOR INSERT 
  WITH CHECK (
    auth.uid() = raised_by AND EXISTS (
      SELECT 1 FROM contract_farming 
      WHERE id = contract_disputes.contract_id 
      AND (buyer_id = auth.uid() OR farmer_id = auth.uid())
    )
  );

-- RLS Policies for payments
CREATE POLICY "Payments viewable by parties" ON public.contract_payments FOR SELECT 
  USING (auth.uid() = paid_by OR auth.uid() = paid_to);
CREATE POLICY "Payers can create payments" ON public.contract_payments FOR INSERT 
  WITH CHECK (auth.uid() = paid_by);

-- Add triggers for updated_at
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_organizations_user_id ON public.organizations(user_id);
CREATE INDEX idx_organizations_verification_status ON public.organizations(verification_status);
CREATE INDEX idx_post_reports_post_id ON public.post_reports(post_id);
CREATE INDEX idx_post_reports_reporter_id ON public.post_reports(reporter_id);
CREATE INDEX idx_contract_docs_contract_id ON public.contract_documents_v2(contract_id);
CREATE INDEX idx_contract_milestones_contract_id ON public.contract_milestones(contract_id);
CREATE INDEX idx_contract_disputes_contract_id ON public.contract_disputes(contract_id);
CREATE INDEX idx_contract_payments_contract_id ON public.contract_payments(contract_id);