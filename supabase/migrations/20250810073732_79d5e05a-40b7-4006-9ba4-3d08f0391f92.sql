-- Secure export-related tables and add basic ownership (retry without IF NOT EXISTS on policies)

-- 1) export_opportunities: add created_by and RLS
alter table if exists public.export_opportunities
  add column if not exists created_by uuid;

alter table public.export_opportunities enable row level security;

create policy "Export: select open or own"
  on public.export_opportunities
  for select
  using (status = 'open' or created_by = auth.uid());

create policy "Export: insert own"
  on public.export_opportunities
  for insert
  with check (created_by = auth.uid());

create policy "Export: update own"
  on public.export_opportunities
  for update
  using (created_by = auth.uid());

create policy "Export: delete own"
  on public.export_opportunities
  for delete
  using (created_by = auth.uid());

-- 2) export_documentation RLS
alter table if exists public.export_documentation enable row level security;

create policy "Export docs: select own"
  on public.export_documentation
  for select
  using (uploaded_by = auth.uid());

create policy "Export docs: insert own"
  on public.export_documentation
  for insert
  with check (uploaded_by = auth.uid());

create policy "Export docs: update own"
  on public.export_documentation
  for update
  using (uploaded_by = auth.uid());

create policy "Export docs: delete own"
  on public.export_documentation
  for delete
  using (uploaded_by = auth.uid());

-- 3) farmer_consolidations RLS
alter table if exists public.farmer_consolidations enable row level security;

create policy "Consolidations: select own"
  on public.farmer_consolidations
  for select
  using (consolidator_id = auth.uid());

create policy "Consolidations: insert own"
  on public.farmer_consolidations
  for insert
  with check (consolidator_id = auth.uid());

create policy "Consolidations: update own"
  on public.farmer_consolidations
  for update
  using (consolidator_id = auth.uid());

create policy "Consolidations: delete own"
  on public.farmer_consolidations
  for delete
  using (consolidator_id = auth.uid());