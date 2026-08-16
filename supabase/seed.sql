-- Synthetic portfolio seed. Every identity uses the reserved .invalid domain.
-- Never place real child, family, staff, incident, medical, payment, or contact data here.

insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
values
  (
    '00000000-0000-0000-0000-000000000000',
    '77777777-7777-4777-8777-777777777771',
    'authenticated',
    'authenticated',
    'director@synthetic.invalid',
    extensions.crypt('synthetic-demo-only', extensions.gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb,
    now(),
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '77777777-7777-4777-8777-777777777772',
    'authenticated',
    'authenticated',
    'educator@synthetic.invalid',
    extensions.crypt('synthetic-demo-only', extensions.gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb,
    now(),
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '77777777-7777-4777-8777-777777777773',
    'authenticated',
    'authenticated',
    'guardian@synthetic.invalid',
    extensions.crypt('synthetic-demo-only', extensions.gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb,
    now(),
    now()
  )
on conflict (id) do nothing;

insert into public.organizations (id, name, timezone, currency, demo_only)
values (
  '11111111-1111-4111-8111-111111111111',
  'Harbour Sprouts Childcare',
  'America/Toronto',
  'CAD',
  true
);

insert into public.locations (id, organization_id, name, timezone)
values (
  '22222222-2222-4222-8222-222222222222',
  '11111111-1111-4111-8111-111111111111',
  'Lakeshore Centre',
  'America/Toronto'
);

insert into public.profiles (id, display_name)
values
  ('77777777-7777-4777-8777-777777777771', 'Jordan Lee'),
  ('77777777-7777-4777-8777-777777777772', 'Alex Rivera'),
  ('77777777-7777-4777-8777-777777777773', 'Avery Chen');

insert into public.memberships (id, organization_id, user_id, status)
values
  ('88888888-8888-4888-8888-888888888881', '11111111-1111-4111-8111-111111111111', '77777777-7777-4777-8777-777777777771', 'active'),
  ('88888888-8888-4888-8888-888888888882', '11111111-1111-4111-8111-111111111111', '77777777-7777-4777-8777-777777777772', 'active'),
  ('88888888-8888-4888-8888-888888888883', '11111111-1111-4111-8111-111111111111', '77777777-7777-4777-8777-777777777773', 'active');

insert into public.role_grants (
  organization_id,
  membership_id,
  role,
  location_id,
  granted_by
)
values
  ('11111111-1111-4111-8111-111111111111', '88888888-8888-4888-8888-888888888881', 'organization_owner', null, '77777777-7777-4777-8777-777777777771'),
  ('11111111-1111-4111-8111-111111111111', '88888888-8888-4888-8888-888888888882', 'staff', '22222222-2222-4222-8222-222222222222', '77777777-7777-4777-8777-777777777771'),
  ('11111111-1111-4111-8111-111111111111', '88888888-8888-4888-8888-888888888883', 'guardian', null, '77777777-7777-4777-8777-777777777771');

insert into public.staff_profiles (id, organization_id, membership_id)
values (
  '99999999-9999-4999-8999-999999999992',
  '11111111-1111-4111-8111-111111111111',
  '88888888-8888-4888-8888-888888888882'
);

insert into public.rooms (id, organization_id, location_id, name, capacity)
values
  ('44444444-4444-4444-8444-444444444441', '11111111-1111-4111-8111-111111111111', '22222222-2222-4222-8222-222222222222', 'Willow Room', 12),
  ('44444444-4444-4444-8444-444444444442', '11111111-1111-4111-8111-111111111111', '22222222-2222-4222-8222-222222222222', 'Cedar Room', 10),
  ('44444444-4444-4444-8444-444444444443', '11111111-1111-4111-8111-111111111111', '22222222-2222-4222-8222-222222222222', 'Maple Room', 14);

insert into public.children (id, organization_id, location_id, display_name, date_of_birth)
values
  ('33333333-3333-4333-8333-333333333331', '11111111-1111-4111-8111-111111111111', '22222222-2222-4222-8222-222222222222', 'Maya Chen', '2022-04-10'),
  ('33333333-3333-4333-8333-333333333332', '11111111-1111-4111-8111-111111111111', '22222222-2222-4222-8222-222222222222', 'Leo Evans', '2023-02-17'),
  ('33333333-3333-4333-8333-333333333333', '11111111-1111-4111-8111-111111111111', '22222222-2222-4222-8222-222222222222', 'Sofia Novak', '2021-09-02'),
  ('33333333-3333-4333-8333-333333333334', '11111111-1111-4111-8111-111111111111', '22222222-2222-4222-8222-222222222222', 'Owen Patel', '2020-11-21');

insert into public.guardians (id, organization_id, profile_id, display_name)
values (
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
  '11111111-1111-4111-8111-111111111111',
  '77777777-7777-4777-8777-777777777773',
  'Avery Chen'
);

insert into public.child_guardians (
  organization_id,
  child_id,
  guardian_id,
  relationship_label,
  can_view_timeline,
  can_view_billing
)
values (
  '11111111-1111-4111-8111-111111111111',
  '33333333-3333-4333-8333-333333333331',
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
  'guardian',
  true,
  true
);

insert into public.room_enrollments (organization_id, room_id, child_id, starts_on)
values (
  '11111111-1111-4111-8111-111111111111',
  '44444444-4444-4444-8444-444444444441',
  '33333333-3333-4333-8333-333333333331',
  '2026-01-01'
);

insert into public.ratio_policy_versions (
  id,
  organization_id,
  location_id,
  label,
  max_children_per_staff,
  room_capacity,
  jurisdiction_reference,
  effective_from,
  reviewed_by
)
values (
  'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1',
  '11111111-1111-4111-8111-111111111111',
  '22222222-2222-4222-8222-222222222222',
  'Synthetic operational policy 2026-01',
  5,
  12,
  'DEMO ONLY - owner jurisdiction decision required',
  '2026-01-01',
  '77777777-7777-4777-8777-777777777771'
);

insert into public.contracts (
  id,
  organization_id,
  child_id,
  guardian_id,
  currency,
  starts_on,
  state
)
values (
  'cccccccc-cccc-4ccc-8ccc-ccccccccccc1',
  '11111111-1111-4111-8111-111111111111',
  '33333333-3333-4333-8333-333333333331',
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
  'CAD',
  '2026-01-01',
  'active'
);

insert into public.rate_plans (
  organization_id,
  contract_id,
  calculation_version,
  rate_type,
  hourly_rate_minor,
  daily_cap_minor,
  grace_minutes,
  late_pickup_rate_minor,
  effective_from
)
values (
  '11111111-1111-4111-8111-111111111111',
  'cccccccc-cccc-4ccc-8ccc-ccccccccccc1',
  'nurtureops-billing-v1',
  'hourly',
  2250,
  18000,
  0,
  100,
  '2026-01-01'
);

insert into public.invoices (
  id,
  organization_id,
  child_id,
  guardian_id,
  contract_id,
  invoice_number,
  status,
  currency,
  period_start,
  period_end,
  subtotal_minor,
  total_minor,
  calculation_version,
  issued_at,
  idempotency_key
)
values (
  '55555555-5555-4555-8555-555555555551',
  '11111111-1111-4111-8111-111111111111',
  '33333333-3333-4333-8333-333333333331',
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
  'cccccccc-cccc-4ccc-8ccc-ccccccccccc1',
  'DEMO-2026-0042',
  'issued',
  'CAD',
  '2026-08-03',
  '2026-08-09',
  84250,
  84250,
  'nurtureops-billing-v1',
  '2026-08-10T14:00:00Z',
  'dddddddd-dddd-4ddd-8ddd-ddddddddddd1'
);
