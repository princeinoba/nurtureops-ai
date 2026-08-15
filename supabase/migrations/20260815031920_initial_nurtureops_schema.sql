begin;

create extension if not exists pgcrypto with schema extensions;
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create type public.app_role as enum (
  'organization_owner',
  'director',
  'staff',
  'billing_manager',
  'guardian',
  'auditor'
);
create type public.membership_status as enum ('invited', 'active', 'suspended', 'revoked');
create type public.attendance_status as enum ('active', 'checked_out', 'review_required');
create type public.invoice_status as enum ('draft', 'issued', 'paid', 'void', 'refunded', 'credited');
create type public.incident_status as enum (
  'draft',
  'submitted',
  'reviewed',
  'guardian_acknowledged',
  'closed'
);
create type public.job_status as enum ('queued', 'processing', 'succeeded', 'failed', 'expired');

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  timezone text not null default 'America/Toronto',
  currency char(3) not null default 'CAD',
  demo_only boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.locations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  name text not null check (char_length(name) between 2 and 120),
  timezone text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (organization_id, id)
);
create index locations_organization_idx on public.locations (organization_id);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete restrict,
  display_name text not null check (char_length(display_name) between 1 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.memberships (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  user_id uuid not null references auth.users(id) on delete restrict,
  status public.membership_status not null default 'invited',
  created_at timestamptz not null default now(),
  revoked_at timestamptz,
  unique (organization_id, user_id),
  unique (organization_id, id)
);
create index memberships_user_org_idx on public.memberships (user_id, organization_id)
  where status = 'active';

create table public.role_grants (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  membership_id uuid not null,
  role public.app_role not null,
  location_id uuid references public.locations(id) on delete restrict,
  granted_by uuid references auth.users(id) on delete restrict,
  granted_at timestamptz not null default now(),
  revoked_at timestamptz,
  foreign key (organization_id, membership_id)
    references public.memberships(organization_id, id) on delete restrict,
  unique nulls not distinct (membership_id, role, location_id, revoked_at)
);
create index role_grants_membership_active_idx on public.role_grants (membership_id, role)
  where revoked_at is null;
create index role_grants_location_idx on public.role_grants (location_id)
  where revoked_at is null;

create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  email_normalized text not null check (email_normalized = lower(email_normalized)),
  token_hash char(64) not null unique,
  role public.app_role not null,
  location_id uuid references public.locations(id) on delete restrict,
  expires_at timestamptz not null,
  consumed_at timestamptz,
  revoked_at timestamptz,
  invited_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  check (expires_at > created_at)
);
create index invitations_org_email_idx on public.invitations (organization_id, email_normalized);

create table public.staff_profiles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  membership_id uuid not null,
  employee_reference text,
  active boolean not null default true,
  foreign key (organization_id, membership_id)
    references public.memberships(organization_id, id) on delete restrict,
  unique (organization_id, membership_id)
);

create table public.children (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  location_id uuid not null references public.locations(id) on delete restrict,
  display_name text not null check (char_length(display_name) between 1 and 100),
  date_of_birth date,
  active boolean not null default true,
  version integer not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (organization_id, location_id)
    references public.locations(organization_id, id) on delete restrict,
  unique (organization_id, id),
  unique (location_id, id)
);
create index children_org_location_active_idx on public.children (organization_id, location_id)
  where active;

create table public.guardians (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  profile_id uuid references public.profiles(id) on delete restrict,
  display_name text not null,
  created_at timestamptz not null default now(),
  unique (organization_id, id)
);
create index guardians_profile_idx on public.guardians (profile_id);

create table public.child_guardians (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  child_id uuid not null,
  guardian_id uuid not null,
  relationship_label text not null,
  can_view_timeline boolean not null default false,
  can_view_billing boolean not null default false,
  active_from date not null default current_date,
  active_until date,
  foreign key (organization_id, child_id)
    references public.children(organization_id, id) on delete restrict,
  foreign key (organization_id, guardian_id)
    references public.guardians(organization_id, id) on delete restrict,
  unique (child_id, guardian_id, active_from)
);
create index child_guardians_guardian_active_idx
  on public.child_guardians (guardian_id, child_id, active_until);

create table public.emergency_contacts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  child_id uuid not null,
  encrypted_payload text not null,
  priority smallint not null check (priority between 1 and 10),
  foreign key (organization_id, child_id)
    references public.children(organization_id, id) on delete restrict
);

create table public.authorized_pickups (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  child_id uuid not null,
  display_name text not null,
  valid_from timestamptz not null,
  valid_until timestamptz,
  revoked_at timestamptz,
  approved_by uuid not null references auth.users(id) on delete restrict,
  foreign key (organization_id, child_id)
    references public.children(organization_id, id) on delete restrict,
  check (valid_until is null or valid_until > valid_from)
);
create index authorized_pickups_child_active_idx
  on public.authorized_pickups (child_id, valid_until) where revoked_at is null;

create table public.child_care_profiles (
  child_id uuid primary key,
  organization_id uuid not null references public.organizations(id) on delete restrict,
  routine_summary text,
  sensitivity_class text not null default 'restricted',
  version integer not null default 1,
  foreign key (organization_id, child_id)
    references public.children(organization_id, id) on delete restrict
);

create table public.allergies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  child_id uuid not null,
  encrypted_summary text not null,
  visibility text not null default 'assigned_staff',
  reviewed_at timestamptz,
  foreign key (organization_id, child_id)
    references public.children(organization_id, id) on delete restrict
);

create table public.care_instructions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  child_id uuid not null,
  encrypted_instruction text not null,
  version integer not null default 1,
  active boolean not null default true,
  foreign key (organization_id, child_id)
    references public.children(organization_id, id) on delete restrict
);

create table public.consents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  child_id uuid not null,
  guardian_id uuid not null,
  consent_type text not null,
  document_version text not null,
  decision text not null check (decision in ('granted', 'declined', 'revoked')),
  decided_at timestamptz not null,
  supersedes_id uuid references public.consents(id) on delete restrict,
  foreign key (organization_id, child_id)
    references public.children(organization_id, id) on delete restrict,
  foreign key (organization_id, guardian_id)
    references public.guardians(organization_id, id) on delete restrict
);

create table public.rooms (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  location_id uuid not null references public.locations(id) on delete restrict,
  name text not null,
  capacity integer not null check (capacity > 0),
  active boolean not null default true,
  foreign key (organization_id, location_id)
    references public.locations(organization_id, id) on delete restrict,
  unique (location_id, name),
  unique (organization_id, id)
);

create table public.room_enrollments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  room_id uuid not null,
  child_id uuid not null,
  starts_on date not null,
  ends_on date,
  foreign key (organization_id, room_id)
    references public.rooms(organization_id, id) on delete restrict,
  foreign key (organization_id, child_id)
    references public.children(organization_id, id) on delete restrict,
  check (ends_on is null or ends_on >= starts_on)
);

create table public.staff_room_assignments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  room_id uuid not null,
  staff_profile_id uuid not null references public.staff_profiles(id) on delete restrict,
  starts_at timestamptz not null,
  ends_at timestamptz,
  foreign key (organization_id, room_id)
    references public.rooms(organization_id, id) on delete restrict,
  check (ends_at is null or ends_at > starts_at)
);

create table public.attendance_sessions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  location_id uuid not null references public.locations(id) on delete restrict,
  child_id uuid not null,
  room_id uuid references public.rooms(id) on delete restrict,
  status public.attendance_status not null default 'active',
  started_at timestamptz not null,
  ended_at timestamptz,
  version integer not null default 1 check (version > 0),
  created_by uuid not null references auth.users(id) on delete restrict,
  foreign key (organization_id, child_id)
    references public.children(organization_id, id) on delete restrict,
  check (ended_at is null or ended_at >= started_at)
);
create unique index attendance_one_active_child_location_idx
  on public.attendance_sessions (organization_id, location_id, child_id)
  where ended_at is null;
create index attendance_location_started_idx
  on public.attendance_sessions (organization_id, location_id, started_at desc);

create table public.attendance_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  session_id uuid not null references public.attendance_sessions(id) on delete restrict,
  event_type text not null check (event_type in ('check_in', 'check_out', 'room_transfer')),
  occurred_at timestamptz not null,
  actor_id uuid not null references auth.users(id) on delete restrict,
  idempotency_key uuid not null,
  device_id_hash text,
  payload_schema_version smallint not null default 1,
  created_at timestamptz not null default now(),
  unique (organization_id, idempotency_key)
);

create table public.attendance_corrections (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  session_id uuid not null references public.attendance_sessions(id) on delete restrict,
  original_started_at timestamptz not null,
  original_ended_at timestamptz,
  corrected_started_at timestamptz not null,
  corrected_ended_at timestamptz,
  reason text not null check (char_length(reason) between 3 and 500),
  actor_id uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now()
);

create table public.offline_event_receipts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  idempotency_key uuid not null,
  event_id uuid references public.attendance_events(id) on delete restrict,
  received_at timestamptz not null default now(),
  result_class text not null,
  unique (organization_id, idempotency_key)
);

create table public.sync_conflicts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  entity_type text not null,
  entity_id uuid not null,
  expected_version integer not null,
  actual_version integer not null,
  status text not null default 'open' check (status in ('open', 'resolved', 'discarded')),
  resolved_by uuid references auth.users(id) on delete restrict,
  created_at timestamptz not null default now()
);

create table public.child_schedules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  child_id uuid not null,
  location_id uuid not null references public.locations(id) on delete restrict,
  weekday smallint not null check (weekday between 0 and 6),
  starts_at time not null,
  ends_at time not null,
  effective_from date not null,
  effective_until date,
  foreign key (organization_id, child_id)
    references public.children(organization_id, id) on delete restrict,
  check (ends_at > starts_at)
);

create table public.staff_shifts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  location_id uuid not null references public.locations(id) on delete restrict,
  staff_profile_id uuid not null references public.staff_profiles(id) on delete restrict,
  room_id uuid references public.rooms(id) on delete restrict,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'planned' check (status in ('planned', 'confirmed', 'completed', 'cancelled')),
  check (ends_at > starts_at)
);
create index staff_shifts_location_time_idx
  on public.staff_shifts (organization_id, location_id, starts_at, ends_at);

create table public.staff_qualifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  staff_profile_id uuid not null references public.staff_profiles(id) on delete restrict,
  qualification_type text not null,
  expires_on date,
  reviewed_at timestamptz,
  status text not null check (status in ('current', 'review', 'expired'))
);

create table public.ratio_policy_versions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  location_id uuid not null references public.locations(id) on delete restrict,
  label text not null,
  max_children_per_staff integer not null check (max_children_per_staff > 0),
  room_capacity integer not null check (room_capacity > 0),
  jurisdiction_reference text,
  effective_from date not null,
  effective_until date,
  reviewed_by uuid references auth.users(id) on delete restrict,
  created_at timestamptz not null default now()
);

create table public.ratio_observations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  room_id uuid not null references public.rooms(id) on delete restrict,
  policy_version_id uuid not null references public.ratio_policy_versions(id) on delete restrict,
  observed_at timestamptz not null,
  children_present integer not null check (children_present >= 0),
  qualified_staff_present integer not null check (qualified_staff_present >= 0),
  required_staff integer not null check (required_staff >= 0),
  result_class text not null check (result_class in ('within_configured_policy', 'review_required')),
  explanation text not null,
  created_at timestamptz not null default now()
);

create table public.daily_care_entries (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  location_id uuid not null references public.locations(id) on delete restrict,
  child_id uuid not null,
  entry_type text not null check (
    entry_type in ('meal', 'nap', 'toileting', 'activity', 'observation', 'mood', 'supply_note', 'arrival_note', 'departure_note')
  ),
  structured_payload jsonb not null default '{}'::jsonb,
  neutral_note text check (char_length(neutral_note) <= 1000),
  occurred_at timestamptz not null,
  actor_id uuid not null references auth.users(id) on delete restrict,
  version integer not null default 1,
  created_at timestamptz not null default now(),
  foreign key (organization_id, child_id)
    references public.children(organization_id, id) on delete restrict
);
create index daily_care_child_time_idx
  on public.daily_care_entries (organization_id, child_id, occurred_at desc);

create table public.daily_report_drafts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  child_id uuid not null,
  report_date date not null,
  content jsonb not null default '{}'::jsonb,
  version integer not null default 1,
  prepared_by uuid not null references auth.users(id) on delete restrict,
  updated_at timestamptz not null default now(),
  foreign key (organization_id, child_id)
    references public.children(organization_id, id) on delete restrict,
  unique (child_id, report_date)
);

create table public.daily_reports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  child_id uuid not null,
  draft_id uuid not null references public.daily_report_drafts(id) on delete restrict,
  report_date date not null,
  immutable_content jsonb not null,
  published_by uuid not null references auth.users(id) on delete restrict,
  published_at timestamptz not null,
  version integer not null,
  foreign key (organization_id, child_id)
    references public.children(organization_id, id) on delete restrict,
  unique (child_id, report_date, version)
);

create table public.parent_visibility (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  daily_report_id uuid not null references public.daily_reports(id) on delete restrict,
  guardian_id uuid not null,
  granted_at timestamptz not null default now(),
  revoked_at timestamptz,
  foreign key (organization_id, guardian_id)
    references public.guardians(organization_id, id) on delete restrict,
  unique (daily_report_id, guardian_id)
);

create table public.incidents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  location_id uuid not null references public.locations(id) on delete restrict,
  child_id uuid not null,
  status public.incident_status not null default 'draft',
  facts jsonb not null default '{}'::jsonb,
  restricted_notes_encrypted text,
  occurred_at timestamptz not null,
  version integer not null default 1,
  created_by uuid not null references auth.users(id) on delete restrict,
  reviewer_id uuid references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  foreign key (organization_id, child_id)
    references public.children(organization_id, id) on delete restrict
);
create index incidents_org_status_idx on public.incidents (organization_id, status, occurred_at desc);

create table public.incident_history (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  incident_id uuid not null references public.incidents(id) on delete restrict,
  from_status public.incident_status,
  to_status public.incident_status not null,
  actor_id uuid not null references auth.users(id) on delete restrict,
  occurred_at timestamptz not null default now(),
  reason_code text not null
);

create table public.medication_authorizations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  child_id uuid not null,
  guardian_id uuid not null,
  instructions_encrypted text not null,
  valid_from timestamptz not null,
  valid_until timestamptz not null,
  reviewed_by uuid references auth.users(id) on delete restrict,
  revoked_at timestamptz,
  foreign key (organization_id, child_id)
    references public.children(organization_id, id) on delete restrict,
  foreign key (organization_id, guardian_id)
    references public.guardians(organization_id, id) on delete restrict,
  check (valid_until > valid_from)
);

create table public.medication_administrations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  authorization_id uuid not null references public.medication_authorizations(id) on delete restrict,
  administered_at timestamptz not null,
  administered_by uuid not null references auth.users(id) on delete restrict,
  reviewed_by uuid references auth.users(id) on delete restrict,
  outcome_code text not null,
  created_at timestamptz not null default now()
);

create table public.message_threads (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  child_id uuid,
  subject text not null check (char_length(subject) between 1 and 160),
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  foreign key (organization_id, child_id)
    references public.children(organization_id, id) on delete restrict
);

create table public.thread_participants (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  thread_id uuid not null references public.message_threads(id) on delete restrict,
  profile_id uuid not null references public.profiles(id) on delete restrict,
  active boolean not null default true,
  unique (thread_id, profile_id)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  thread_id uuid not null references public.message_threads(id) on delete restrict,
  author_id uuid not null references auth.users(id) on delete restrict,
  body_encrypted text not null,
  state text not null default 'draft' check (state in ('draft', 'reviewed', 'queued', 'sent', 'failed')),
  reviewed_by uuid references auth.users(id) on delete restrict,
  created_at timestamptz not null default now()
);

create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  location_id uuid references public.locations(id) on delete restrict,
  title text not null,
  body_encrypted text not null,
  state text not null default 'draft' check (state in ('draft', 'reviewed', 'queued', 'sent', 'failed')),
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now()
);

create table public.notification_preferences (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  profile_id uuid not null references public.profiles(id) on delete restrict,
  channel text not null check (channel in ('email', 'sms', 'in_app')),
  enabled boolean not null default false,
  quiet_hours_start time,
  quiet_hours_end time,
  unique (organization_id, profile_id, channel)
);

create table public.notification_deliveries (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  message_id uuid references public.messages(id) on delete restrict,
  channel text not null,
  provider_reference_hash text,
  idempotency_key uuid not null,
  state text not null check (state in ('queued', 'sent', 'failed', 'disabled')),
  attempted_at timestamptz,
  unique (organization_id, idempotency_key)
);

create table public.contracts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  child_id uuid not null,
  guardian_id uuid not null,
  currency char(3) not null,
  starts_on date not null,
  ends_on date,
  version integer not null default 1,
  state text not null default 'draft' check (state in ('draft', 'active', 'ended')),
  foreign key (organization_id, child_id)
    references public.children(organization_id, id) on delete restrict,
  foreign key (organization_id, guardian_id)
    references public.guardians(organization_id, id) on delete restrict
);

create table public.rate_plans (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  contract_id uuid not null references public.contracts(id) on delete restrict,
  calculation_version text not null,
  rate_type text not null check (rate_type in ('hourly', 'fixed_daily')),
  hourly_rate_minor bigint check (hourly_rate_minor >= 0),
  fixed_daily_rate_minor bigint check (fixed_daily_rate_minor >= 0),
  daily_cap_minor bigint check (daily_cap_minor >= 0),
  grace_minutes integer not null default 0 check (grace_minutes >= 0),
  late_pickup_rate_minor bigint not null default 0 check (late_pickup_rate_minor >= 0),
  effective_from date not null,
  effective_until date,
  version integer not null default 1
);

create table public.subsidies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  contract_id uuid not null references public.contracts(id) on delete restrict,
  amount_minor bigint not null check (amount_minor >= 0),
  currency char(3) not null,
  reference text,
  effective_from date not null,
  effective_until date
);

create table public.credits (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  contract_id uuid not null references public.contracts(id) on delete restrict,
  amount_minor bigint not null check (amount_minor > 0),
  currency char(3) not null,
  reason text not null,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  applied_at timestamptz
);

create table public.invoice_sequences (
  organization_id uuid primary key references public.organizations(id) on delete restrict,
  prefix text not null default 'INV',
  next_value bigint not null default 1 check (next_value > 0),
  updated_at timestamptz not null default now()
);

create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  child_id uuid not null,
  guardian_id uuid not null,
  contract_id uuid not null references public.contracts(id) on delete restrict,
  invoice_number text,
  status public.invoice_status not null default 'draft',
  currency char(3) not null,
  period_start date not null,
  period_end date not null,
  subtotal_minor bigint not null default 0 check (subtotal_minor >= 0),
  subsidies_minor bigint not null default 0 check (subsidies_minor >= 0),
  credits_minor bigint not null default 0 check (credits_minor >= 0),
  total_minor bigint not null default 0 check (total_minor >= 0),
  calculation_version text not null,
  issued_at timestamptz,
  paid_at timestamptz,
  voided_at timestamptz,
  version integer not null default 1,
  idempotency_key uuid not null,
  created_at timestamptz not null default now(),
  foreign key (organization_id, child_id)
    references public.children(organization_id, id) on delete restrict,
  foreign key (organization_id, guardian_id)
    references public.guardians(organization_id, id) on delete restrict,
  unique (organization_id, invoice_number),
  unique (organization_id, idempotency_key),
  check (period_end >= period_start),
  check ((status = 'draft' and issued_at is null) or status <> 'draft')
);
create index invoices_org_status_period_idx
  on public.invoices (organization_id, status, period_start desc);
create index invoices_guardian_idx on public.invoices (guardian_id, issued_at desc);

create table public.invoice_lines (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  invoice_id uuid not null references public.invoices(id) on delete restrict,
  source_type text not null,
  source_id text not null,
  service_date date not null,
  description text not null,
  quantity_minutes integer check (quantity_minutes >= 0),
  amount_minor bigint not null check (amount_minor >= 0),
  currency char(3) not null,
  calculation_snapshot jsonb not null,
  created_at timestamptz not null default now()
);
create index invoice_lines_invoice_idx on public.invoice_lines (invoice_id);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  invoice_id uuid not null references public.invoices(id) on delete restrict,
  provider text not null default 'manual_demo',
  provider_reference_hash text,
  amount_minor bigint not null check (amount_minor > 0),
  currency char(3) not null,
  state text not null check (state in ('pending', 'succeeded', 'failed', 'refunded', 'manual_demo')),
  recorded_at timestamptz not null default now()
);

create table public.credit_notes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  invoice_id uuid not null references public.invoices(id) on delete restrict,
  credit_number text not null,
  reason text not null,
  amount_minor bigint not null check (amount_minor > 0),
  currency char(3) not null,
  issued_at timestamptz not null,
  issued_by uuid not null references auth.users(id) on delete restrict,
  unique (organization_id, credit_number)
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  child_id uuid,
  storage_path text not null unique,
  original_filename text not null,
  mime_type text not null,
  bytes bigint not null check (bytes between 1 and 10485760),
  sensitivity_class text not null default 'restricted',
  uploaded_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  expires_at timestamptz,
  foreign key (organization_id, child_id)
    references public.children(organization_id, id) on delete restrict
);

create table public.attachments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  document_id uuid not null references public.documents(id) on delete restrict,
  entity_type text not null,
  entity_id uuid not null,
  created_at timestamptz not null default now()
);

create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  actor_id uuid references auth.users(id) on delete restrict,
  request_id uuid not null,
  event_type text not null,
  entity_type text not null,
  entity_id uuid,
  result_class text not null,
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now(),
  check (not (metadata ?| array['content', 'body', 'note', 'narrative', 'prompt']))
);
create index audit_events_org_time_idx
  on public.audit_events (organization_id, occurred_at desc);

create table public.security_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete restrict,
  actor_id uuid references auth.users(id) on delete restrict,
  event_type text not null,
  result_class text not null,
  request_id uuid not null,
  occurred_at timestamptz not null default now()
);

create table public.export_jobs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  requested_by uuid not null references auth.users(id) on delete restrict,
  status public.job_status not null default 'queued',
  format_version text not null,
  manifest_path text,
  expires_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.deletion_requests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  requested_by uuid not null references auth.users(id) on delete restrict,
  scope text not null,
  status public.job_status not null default 'queued',
  reconciliation_report jsonb,
  retention_exceptions jsonb,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table public.billing_exports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  export_job_id uuid not null references public.export_jobs(id) on delete restrict,
  period_start date not null,
  period_end date not null,
  created_at timestamptz not null default now()
);

create table public.ai_runs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  actor_id uuid not null references auth.users(id) on delete restrict,
  feature text not null,
  provider text not null,
  model text not null,
  prompt_policy_version text not null,
  input_field_manifest text[] not null,
  source_record_ids uuid[] not null default '{}',
  output_schema_version text not null,
  review_status text not null check (review_status in ('proposed', 'approved', 'rejected', 'failed')),
  result_class text not null,
  latency_ms integer check (latency_ms >= 0),
  input_tokens integer check (input_tokens >= 0),
  output_tokens integer check (output_tokens >= 0),
  cost_microunits bigint check (cost_microunits >= 0),
  created_at timestamptz not null default now(),
  check (not (input_field_manifest && array[
    'allergies',
    'medication',
    'incident_restricted_notes',
    'safeguarding_notes',
    'guardian_message_body'
  ]))
);

create table public.ai_approvals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  ai_run_id uuid not null references public.ai_runs(id) on delete restrict,
  approved_by uuid not null references auth.users(id) on delete restrict,
  approved_at timestamptz not null,
  expected_record_version integer not null,
  proposal_hash char(64) not null,
  decision text not null check (decision in ('approved', 'rejected')),
  command_result_class text
);

create table public.outbox_jobs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  job_type text not null,
  idempotency_key uuid not null,
  payload jsonb not null,
  status public.job_status not null default 'queued',
  attempt_count integer not null default 0 check (attempt_count >= 0),
  next_attempt_at timestamptz not null default now(),
  last_error_code text,
  deployment_version text,
  created_at timestamptz not null default now(),
  unique (organization_id, idempotency_key),
  check (not (payload ?| array['message_body', 'child_narrative', 'incident_narrative']))
);
create index outbox_jobs_ready_idx on public.outbox_jobs (next_attempt_at)
  where status in ('queued', 'failed');

create or replace function private.is_org_member(target_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.memberships m
    where m.organization_id = target_organization_id
      and m.user_id = (select auth.uid())
      and m.status = 'active'
      and m.revoked_at is null
  );
$$;

create or replace function private.has_role(
  target_organization_id uuid,
  allowed_roles public.app_role[]
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.memberships m
    join public.role_grants rg
      on rg.membership_id = m.id
     and rg.organization_id = m.organization_id
     and rg.revoked_at is null
    where m.organization_id = target_organization_id
      and m.user_id = (select auth.uid())
      and m.status = 'active'
      and rg.role = any(allowed_roles)
  );
$$;

create or replace function private.staff_has_location(
  target_organization_id uuid,
  target_location_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.memberships m
    join public.role_grants rg
      on rg.membership_id = m.id
     and rg.organization_id = m.organization_id
     and rg.revoked_at is null
    where m.organization_id = target_organization_id
      and m.user_id = (select auth.uid())
      and m.status = 'active'
      and rg.role in ('staff', 'director', 'organization_owner')
      and (rg.location_id is null or rg.location_id = target_location_id)
  );
$$;

create or replace function private.guardian_has_child_access(
  target_organization_id uuid,
  target_child_id uuid,
  require_billing boolean default false
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.guardians g
    join public.child_guardians cg
      on cg.guardian_id = g.id
     and cg.organization_id = g.organization_id
    where g.organization_id = target_organization_id
      and g.profile_id = (select auth.uid())
      and cg.child_id = target_child_id
      and cg.active_from <= current_date
      and (cg.active_until is null or cg.active_until >= current_date)
      and case when require_billing then cg.can_view_billing else cg.can_view_timeline end
  );
$$;

revoke execute on all functions in schema private from public, anon, authenticated;
grant usage on schema private to authenticated;
grant execute on function private.is_org_member(uuid) to authenticated;
grant execute on function private.has_role(uuid, public.app_role[]) to authenticated;
grant execute on function private.staff_has_location(uuid, uuid) to authenticated;
grant execute on function private.guardian_has_child_access(uuid, uuid, boolean) to authenticated;

create or replace function private.prevent_issued_invoice_line_mutation()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  current_status public.invoice_status;
begin
  select i.status into current_status
  from public.invoices i
  where i.id = coalesce(old.invoice_id, new.invoice_id);

  if current_status <> 'draft' then
    raise exception 'Issued invoice lines are immutable';
  end if;
  return case when tg_op = 'DELETE' then old else new end;
end;
$$;

create trigger invoice_lines_immutable_after_issue
before update or delete on public.invoice_lines
for each row execute function private.prevent_issued_invoice_line_mutation();

create or replace function private.enforce_invoice_transition()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if old.status <> 'draft' and (
    new.subtotal_minor <> old.subtotal_minor
    or new.subsidies_minor <> old.subsidies_minor
    or new.credits_minor <> old.credits_minor
    or new.total_minor <> old.total_minor
    or new.period_start <> old.period_start
    or new.period_end <> old.period_end
    or new.calculation_version <> old.calculation_version
  ) then
    raise exception 'Issued invoice financial data is immutable';
  end if;

  if old.status = new.status then
    return new;
  end if;

  if not (
    (old.status = 'draft' and new.status in ('issued', 'void'))
    or (old.status = 'issued' and new.status in ('paid', 'void', 'credited'))
    or (old.status = 'paid' and new.status in ('refunded', 'credited'))
  ) then
    raise exception 'Invalid invoice state transition';
  end if;

  if new.status = 'issued' and (new.invoice_number is null or new.issued_at is null) then
    raise exception 'Issued invoices require a number and issued timestamp';
  end if;
  return new;
end;
$$;

create trigger invoices_valid_transition
before update on public.invoices
for each row execute function private.enforce_invoice_transition();

create or replace function private.prevent_immutable_history_change()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception 'Immutable history cannot be updated or deleted';
end;
$$;

create trigger audit_events_immutable
before update or delete on public.audit_events
for each row execute function private.prevent_immutable_history_change();
create trigger consents_immutable
before update or delete on public.consents
for each row execute function private.prevent_immutable_history_change();
create trigger incident_history_immutable
before update or delete on public.incident_history
for each row execute function private.prevent_immutable_history_change();

do $$
declare
  target_table text;
begin
  foreach target_table in array array[
    'organizations','locations','profiles','memberships','role_grants','invitations',
    'staff_profiles','children','guardians','child_guardians','emergency_contacts',
    'authorized_pickups','child_care_profiles','allergies','care_instructions','consents',
    'rooms','room_enrollments','staff_room_assignments','child_schedules','staff_shifts',
    'staff_qualifications','ratio_policy_versions','ratio_observations','attendance_sessions',
    'attendance_events','attendance_corrections','offline_event_receipts','sync_conflicts',
    'daily_care_entries','daily_report_drafts','daily_reports','parent_visibility','incidents',
    'incident_history','medication_authorizations','medication_administrations','message_threads',
    'thread_participants','messages','announcements','notification_preferences',
    'notification_deliveries','contracts','rate_plans','subsidies','credits','invoice_sequences',
    'invoices','invoice_lines','payments','credit_notes','documents','attachments','audit_events',
    'security_events','export_jobs','deletion_requests','billing_exports','ai_runs','ai_approvals',
    'outbox_jobs'
  ]
  loop
    execute format('alter table public.%I enable row level security', target_table);
    execute format('alter table public.%I force row level security', target_table);
  end loop;
end;
$$;

revoke all on all tables in schema public from anon, authenticated;
grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;

grant select on public.organizations, public.locations, public.profiles, public.memberships,
  public.role_grants, public.staff_profiles, public.children, public.guardians,
  public.child_guardians, public.authorized_pickups, public.rooms, public.room_enrollments,
  public.staff_room_assignments, public.child_schedules, public.staff_shifts,
  public.staff_qualifications, public.ratio_policy_versions, public.ratio_observations,
  public.attendance_sessions, public.attendance_events, public.attendance_corrections,
  public.offline_event_receipts, public.sync_conflicts, public.daily_care_entries,
  public.daily_report_drafts, public.daily_reports, public.parent_visibility,
  public.message_threads, public.thread_participants, public.messages, public.announcements,
  public.notification_preferences, public.contracts, public.rate_plans, public.subsidies,
  public.credits, public.invoices, public.invoice_lines, public.payments, public.credit_notes,
  public.documents, public.attachments, public.export_jobs, public.billing_exports
to authenticated;

grant select on public.incidents, public.incident_history, public.medication_authorizations,
  public.medication_administrations, public.audit_events, public.deletion_requests,
  public.ai_runs, public.ai_approvals
to authenticated;

grant insert, update on public.children, public.guardians, public.child_guardians,
  public.authorized_pickups, public.rooms, public.room_enrollments, public.staff_room_assignments,
  public.child_schedules, public.staff_shifts, public.attendance_sessions,
  public.daily_care_entries, public.daily_report_drafts, public.message_threads,
  public.thread_participants, public.messages, public.announcements,
  public.notification_preferences, public.contracts, public.rate_plans, public.subsidies,
  public.credits, public.invoices, public.invoice_lines
to authenticated;

grant insert on public.attendance_events, public.attendance_corrections,
  public.offline_event_receipts, public.sync_conflicts, public.daily_reports,
  public.parent_visibility, public.incidents, public.incident_history,
  public.medication_authorizations, public.medication_administrations,
  public.payments, public.credit_notes, public.documents, public.attachments,
  public.export_jobs, public.deletion_requests, public.billing_exports,
  public.ai_runs, public.ai_approvals
to authenticated;

create or replace function private.is_thread_participant(target_thread_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.thread_participants tp
    where tp.thread_id = target_thread_id
      and tp.profile_id = (select auth.uid())
      and tp.active
  );
$$;

create or replace function private.can_access_attendance_session(target_session_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.attendance_sessions s
    where s.id = target_session_id
      and (
        private.has_role(s.organization_id, array[
          'organization_owner','director','billing_manager','auditor'
        ]::public.app_role[])
        or private.staff_has_location(s.organization_id, s.location_id)
        or private.guardian_has_child_access(s.organization_id, s.child_id, false)
      )
  );
$$;

create or replace function private.can_access_contract(target_contract_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.contracts c
    where c.id = target_contract_id
      and (
        private.has_role(c.organization_id, array[
          'organization_owner','director','billing_manager','auditor'
        ]::public.app_role[])
        or private.guardian_has_child_access(c.organization_id, c.child_id, true)
      )
  );
$$;

revoke execute on function private.is_thread_participant(uuid) from public, anon;
revoke execute on function private.can_access_attendance_session(uuid) from public, anon;
revoke execute on function private.can_access_contract(uuid) from public, anon;
grant execute on function private.is_thread_participant(uuid) to authenticated;
grant execute on function private.can_access_attendance_session(uuid) to authenticated;
grant execute on function private.can_access_contract(uuid) to authenticated;

create policy profiles_self_read on public.profiles
for select to authenticated
using (id = (select auth.uid()));
create policy profiles_self_update on public.profiles
for update to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

create policy organizations_member_read on public.organizations
for select to authenticated
using (private.is_org_member(id));
create policy organizations_owner_update on public.organizations
for update to authenticated
using (private.has_role(id, array['organization_owner']::public.app_role[]))
with check (private.has_role(id, array['organization_owner']::public.app_role[]));

create policy memberships_self_or_admin_read on public.memberships
for select to authenticated
using (
  user_id = (select auth.uid())
  or private.has_role(organization_id, array['organization_owner','director','auditor']::public.app_role[])
);
create policy memberships_owner_manage on public.memberships
for update to authenticated
using (private.has_role(organization_id, array['organization_owner']::public.app_role[]))
with check (private.has_role(organization_id, array['organization_owner']::public.app_role[]));

create policy role_grants_self_or_admin_read on public.role_grants
for select to authenticated
using (
  exists (
    select 1 from public.memberships m
    where m.id = membership_id and m.user_id = (select auth.uid())
  )
  or private.has_role(organization_id, array['organization_owner','director','auditor']::public.app_role[])
);

create policy invitations_admin_read on public.invitations
for select to authenticated
using (private.has_role(organization_id, array['organization_owner','director']::public.app_role[]));

do $$
declare
  target_table text;
begin
  foreach target_table in array array['locations','rooms']
  loop
    execute format(
      'create policy %I on public.%I for select to authenticated using (private.is_org_member(organization_id))',
      target_table || '_member_read',
      target_table
    );
  end loop;

  foreach target_table in array array[
    'staff_profiles','staff_room_assignments','child_schedules','staff_shifts',
    'staff_qualifications','ratio_policy_versions','ratio_observations'
  ]
  loop
    execute format(
      'create policy %I on public.%I for select to authenticated using (private.has_role(organization_id, array[''organization_owner'',''director'',''staff'',''auditor'']::public.app_role[]))',
      target_table || '_operator_read',
      target_table
    );
  end loop;

  foreach target_table in array array[
    'locations','rooms','room_enrollments','staff_room_assignments','child_schedules',
    'staff_shifts','staff_qualifications','ratio_policy_versions'
  ]
  loop
    execute format(
      'create policy %I on public.%I for all to authenticated using (private.has_role(organization_id, array[''organization_owner'',''director'']::public.app_role[])) with check (private.has_role(organization_id, array[''organization_owner'',''director'']::public.app_role[]))',
      target_table || '_director_manage',
      target_table
    );
  end loop;
end;
$$;

create policy children_purpose_read on public.children
for select to authenticated
using (
  private.has_role(organization_id, array[
    'organization_owner','director','billing_manager','auditor'
  ]::public.app_role[])
  or private.staff_has_location(organization_id, location_id)
  or private.guardian_has_child_access(organization_id, id, false)
);
create policy children_director_manage on public.children
for all to authenticated
using (private.has_role(organization_id, array['organization_owner','director']::public.app_role[]))
with check (private.has_role(organization_id, array['organization_owner','director']::public.app_role[]));

create policy guardians_purpose_read on public.guardians
for select to authenticated
using (
  profile_id = (select auth.uid())
  or private.has_role(organization_id, array[
    'organization_owner','director','billing_manager','auditor'
  ]::public.app_role[])
);
create policy guardians_director_manage on public.guardians
for all to authenticated
using (private.has_role(organization_id, array['organization_owner','director']::public.app_role[]))
with check (private.has_role(organization_id, array['organization_owner','director']::public.app_role[]));

create policy child_guardians_relationship_read on public.child_guardians
for select to authenticated
using (
  private.has_role(organization_id, array[
    'organization_owner','director','billing_manager','auditor'
  ]::public.app_role[])
  or private.guardian_has_child_access(organization_id, child_id, false)
);
create policy child_guardians_director_manage on public.child_guardians
for all to authenticated
using (private.has_role(organization_id, array['organization_owner','director']::public.app_role[]))
with check (private.has_role(organization_id, array['organization_owner','director']::public.app_role[]));

create policy authorized_pickups_purpose_read on public.authorized_pickups
for select to authenticated
using (
  private.has_role(organization_id, array['organization_owner','director']::public.app_role[])
  or private.guardian_has_child_access(organization_id, child_id, false)
);
create policy authorized_pickups_director_manage on public.authorized_pickups
for all to authenticated
using (private.has_role(organization_id, array['organization_owner','director']::public.app_role[]))
with check (private.has_role(organization_id, array['organization_owner','director']::public.app_role[]));

create policy room_enrollments_operator_read on public.room_enrollments
for select to authenticated
using (
  private.has_role(organization_id, array['organization_owner','director','staff','auditor']::public.app_role[])
);

create policy attendance_sessions_purpose_read on public.attendance_sessions
for select to authenticated
using (
  private.has_role(organization_id, array[
    'organization_owner','director','billing_manager','auditor'
  ]::public.app_role[])
  or private.staff_has_location(organization_id, location_id)
  or private.guardian_has_child_access(organization_id, child_id, false)
);
create policy attendance_sessions_staff_write on public.attendance_sessions
for all to authenticated
using (private.staff_has_location(organization_id, location_id))
with check (private.staff_has_location(organization_id, location_id));

do $$
declare
  target_table text;
begin
  foreach target_table in array array[
    'attendance_events','attendance_corrections'
  ]
  loop
    execute format(
      'create policy %I on public.%I for select to authenticated using (private.can_access_attendance_session(session_id))',
      target_table || '_purpose_read',
      target_table
    );
  end loop;
end;
$$;

create policy attendance_events_staff_insert on public.attendance_events
for insert to authenticated
with check (private.can_access_attendance_session(session_id));
create policy attendance_corrections_director_insert on public.attendance_corrections
for insert to authenticated
with check (
  private.has_role(organization_id, array['organization_owner','director']::public.app_role[])
  and private.can_access_attendance_session(session_id)
);
create policy offline_receipts_member_read on public.offline_event_receipts
for select to authenticated using (private.is_org_member(organization_id));
create policy offline_receipts_staff_insert on public.offline_event_receipts
for insert to authenticated with check (private.is_org_member(organization_id));

create policy sync_conflicts_operator_read on public.sync_conflicts
for select to authenticated
using (private.has_role(organization_id, array['organization_owner','director','staff']::public.app_role[]));
create policy sync_conflicts_operator_insert on public.sync_conflicts
for insert to authenticated
with check (private.has_role(organization_id, array['organization_owner','director','staff']::public.app_role[]));

create policy care_entries_operator_read on public.daily_care_entries
for select to authenticated
using (
  private.has_role(organization_id, array['organization_owner','director']::public.app_role[])
  or private.staff_has_location(organization_id, location_id)
);
create policy care_entries_staff_write on public.daily_care_entries
for all to authenticated
using (private.staff_has_location(organization_id, location_id))
with check (private.staff_has_location(organization_id, location_id));

create policy report_drafts_operator_read on public.daily_report_drafts
for select to authenticated
using (private.has_role(organization_id, array['organization_owner','director','staff']::public.app_role[]));
create policy report_drafts_operator_write on public.daily_report_drafts
for all to authenticated
using (private.has_role(organization_id, array['organization_owner','director','staff']::public.app_role[]))
with check (private.has_role(organization_id, array['organization_owner','director','staff']::public.app_role[]));

create policy daily_reports_approved_read on public.daily_reports
for select to authenticated
using (
  private.has_role(organization_id, array['organization_owner','director','staff','auditor']::public.app_role[])
  or private.guardian_has_child_access(organization_id, child_id, false)
);
create policy daily_reports_staff_insert on public.daily_reports
for insert to authenticated
with check (private.has_role(organization_id, array['organization_owner','director','staff']::public.app_role[]));

create policy parent_visibility_purpose_read on public.parent_visibility
for select to authenticated
using (
  private.has_role(organization_id, array['organization_owner','director','staff','auditor']::public.app_role[])
  or exists (
    select 1 from public.guardians g
    where g.id = guardian_id and g.profile_id = (select auth.uid())
  )
);
create policy parent_visibility_staff_insert on public.parent_visibility
for insert to authenticated
with check (private.has_role(organization_id, array['organization_owner','director','staff']::public.app_role[]));

do $$
declare
  target_table text;
begin
  foreach target_table in array array[
    'incidents','incident_history','medication_authorizations','medication_administrations'
  ]
  loop
    execute format(
      'create policy %I on public.%I for select to authenticated using (private.has_role(organization_id, array[''organization_owner'',''director'',''auditor'']::public.app_role[]))',
      target_table || '_restricted_read',
      target_table
    );
  end loop;
end;
$$;

create policy incidents_director_insert on public.incidents
for insert to authenticated
with check (private.has_role(organization_id, array['organization_owner','director']::public.app_role[]));
create policy incident_history_director_insert on public.incident_history
for insert to authenticated
with check (private.has_role(organization_id, array['organization_owner','director']::public.app_role[]));
create policy medication_auth_director_insert on public.medication_authorizations
for insert to authenticated
with check (private.has_role(organization_id, array['organization_owner','director']::public.app_role[]));
create policy medication_admin_director_insert on public.medication_administrations
for insert to authenticated
with check (private.has_role(organization_id, array['organization_owner','director']::public.app_role[]));

create policy threads_participant_read on public.message_threads
for select to authenticated
using (
  private.is_thread_participant(id)
  or private.has_role(organization_id, array['organization_owner','director','auditor']::public.app_role[])
);
create policy threads_member_insert on public.message_threads
for insert to authenticated
with check (private.is_org_member(organization_id) and created_by = (select auth.uid()));

create policy thread_participants_scoped_read on public.thread_participants
for select to authenticated
using (
  profile_id = (select auth.uid())
  or private.is_thread_participant(thread_id)
  or private.has_role(organization_id, array['organization_owner','director','auditor']::public.app_role[])
);
create policy thread_participants_director_manage on public.thread_participants
for all to authenticated
using (private.has_role(organization_id, array['organization_owner','director']::public.app_role[]))
with check (private.has_role(organization_id, array['organization_owner','director']::public.app_role[]));

create policy messages_participant_read on public.messages
for select to authenticated
using (private.is_thread_participant(thread_id));
create policy messages_participant_insert on public.messages
for insert to authenticated
with check (
  author_id = (select auth.uid())
  and private.is_thread_participant(thread_id)
  and state = 'draft'
);
create policy messages_author_draft_update on public.messages
for update to authenticated
using (author_id = (select auth.uid()) and state = 'draft')
with check (author_id = (select auth.uid()) and state = 'draft');

create policy announcements_member_read on public.announcements
for select to authenticated
using (private.is_org_member(organization_id) and state = 'sent');
create policy announcements_director_write on public.announcements
for all to authenticated
using (private.has_role(organization_id, array['organization_owner','director']::public.app_role[]))
with check (private.has_role(organization_id, array['organization_owner','director']::public.app_role[]));

create policy notification_preferences_self_read on public.notification_preferences
for select to authenticated
using (profile_id = (select auth.uid()));
create policy notification_preferences_self_write on public.notification_preferences
for all to authenticated
using (profile_id = (select auth.uid()))
with check (profile_id = (select auth.uid()));

create policy contracts_purpose_read on public.contracts
for select to authenticated
using (private.can_access_contract(id));
create policy contracts_billing_write on public.contracts
for all to authenticated
using (private.has_role(organization_id, array['organization_owner','director','billing_manager']::public.app_role[]))
with check (private.has_role(organization_id, array['organization_owner','director','billing_manager']::public.app_role[]));

do $$
declare
  target_table text;
begin
  foreach target_table in array array['rate_plans','subsidies','credits']
  loop
    execute format(
      'create policy %I on public.%I for select to authenticated using (private.can_access_contract(contract_id))',
      target_table || '_purpose_read',
      target_table
    );
    execute format(
      'create policy %I on public.%I for all to authenticated using (private.has_role(organization_id, array[''organization_owner'',''director'',''billing_manager'']::public.app_role[])) with check (private.has_role(organization_id, array[''organization_owner'',''director'',''billing_manager'']::public.app_role[]))',
      target_table || '_billing_write',
      target_table
    );
  end loop;
end;
$$;

create policy invoices_purpose_read on public.invoices
for select to authenticated
using (
  private.has_role(organization_id, array[
    'organization_owner','director','billing_manager','auditor'
  ]::public.app_role[])
  or private.guardian_has_child_access(organization_id, child_id, true)
);
create policy invoices_billing_write on public.invoices
for all to authenticated
using (private.has_role(organization_id, array['organization_owner','director','billing_manager']::public.app_role[]))
with check (private.has_role(organization_id, array['organization_owner','director','billing_manager']::public.app_role[]));

create or replace function private.can_access_invoice(target_invoice_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.invoices i
    where i.id = target_invoice_id
      and (
        private.has_role(i.organization_id, array[
          'organization_owner','director','billing_manager','auditor'
        ]::public.app_role[])
        or private.guardian_has_child_access(i.organization_id, i.child_id, true)
      )
  );
$$;
revoke execute on function private.can_access_invoice(uuid) from public, anon;
grant execute on function private.can_access_invoice(uuid) to authenticated;

do $$
declare
  target_table text;
begin
  foreach target_table in array array['invoice_lines','payments','credit_notes']
  loop
    execute format(
      'create policy %I on public.%I for select to authenticated using (private.can_access_invoice(invoice_id))',
      target_table || '_purpose_read',
      target_table
    );
  end loop;
end;
$$;
create policy invoice_lines_billing_write on public.invoice_lines
for all to authenticated
using (private.has_role(organization_id, array['organization_owner','director','billing_manager']::public.app_role[]))
with check (private.has_role(organization_id, array['organization_owner','director','billing_manager']::public.app_role[]));
create policy payments_billing_insert on public.payments
for insert to authenticated
with check (private.has_role(organization_id, array['organization_owner','director','billing_manager']::public.app_role[]));
create policy credit_notes_billing_insert on public.credit_notes
for insert to authenticated
with check (private.has_role(organization_id, array['organization_owner','director','billing_manager']::public.app_role[]));

create policy documents_purpose_read on public.documents
for select to authenticated
using (
  private.has_role(organization_id, array['organization_owner','director','staff','auditor']::public.app_role[])
  or (child_id is not null and private.guardian_has_child_access(organization_id, child_id, false))
);
create policy documents_operator_insert on public.documents
for insert to authenticated
with check (private.has_role(organization_id, array['organization_owner','director','staff']::public.app_role[]));
create policy attachments_operator_read on public.attachments
for select to authenticated
using (private.has_role(organization_id, array['organization_owner','director','staff','auditor']::public.app_role[]));
create policy attachments_operator_insert on public.attachments
for insert to authenticated
with check (private.has_role(organization_id, array['organization_owner','director','staff']::public.app_role[]));

create policy audit_privileged_read on public.audit_events
for select to authenticated
using (private.has_role(organization_id, array['organization_owner','director','auditor']::public.app_role[]));

do $$
declare
  target_table text;
begin
  foreach target_table in array array['export_jobs','deletion_requests','billing_exports']
  loop
    execute format(
      'create policy %I on public.%I for select to authenticated using (private.has_role(organization_id, array[''organization_owner'',''director'',''auditor'']::public.app_role[]))',
      target_table || '_privileged_read',
      target_table
    );
    execute format(
      'create policy %I on public.%I for insert to authenticated with check (private.has_role(organization_id, array[''organization_owner'',''director'']::public.app_role[]))',
      target_table || '_privileged_insert',
      target_table
    );
  end loop;
end;
$$;

create policy ai_runs_actor_or_admin_read on public.ai_runs
for select to authenticated
using (
  actor_id = (select auth.uid())
  or private.has_role(organization_id, array['organization_owner','director','auditor']::public.app_role[])
);
create policy ai_runs_actor_insert on public.ai_runs
for insert to authenticated
with check (actor_id = (select auth.uid()) and private.is_org_member(organization_id));
create policy ai_approvals_actor_or_admin_read on public.ai_approvals
for select to authenticated
using (
  approved_by = (select auth.uid())
  or private.has_role(organization_id, array['organization_owner','director','auditor']::public.app_role[])
);
create policy ai_approvals_actor_insert on public.ai_approvals
for insert to authenticated
with check (approved_by = (select auth.uid()) and private.is_org_member(organization_id));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'nurtureops-private',
  'nurtureops-private',
  false,
  10485760,
  array['application/pdf','image/jpeg','image/png','text/plain']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy nurtureops_private_storage_read on storage.objects
for select to authenticated
using (
  bucket_id = 'nurtureops-private'
  and (storage.foldername(name))[1] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
  and private.is_org_member(((storage.foldername(name))[1])::uuid)
);

create policy nurtureops_private_storage_insert on storage.objects
for insert to authenticated
with check (
  bucket_id = 'nurtureops-private'
  and (storage.foldername(name))[1] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
  and private.has_role(
    ((storage.foldername(name))[1])::uuid,
    array['organization_owner','director','staff']::public.app_role[]
  )
);

comment on table public.ratio_policy_versions is
  'Reviewed operational configurations only; no legal compliance certification.';
comment on table public.ai_runs is
  'Content-free AI run metadata. Raw prompts, provider bodies, and child narratives are prohibited.';
comment on table public.audit_events is
  'Immutable content-free audit metadata. Narrative keys are rejected.';

commit;
