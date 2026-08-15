\set ON_ERROR_STOP on

begin;

do $$
declare
  unsecured text;
begin
  select string_agg(c.relname, ', ' order by c.relname)
  into unsecured
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public'
    and c.relkind = 'r'
    and (not c.relrowsecurity or not c.relforcerowsecurity);
  if unsecured is not null then
    raise exception 'Public tables without forced RLS: %', unsecured;
  end if;
  if has_table_privilege('anon', 'public.children', 'select') then
    raise exception 'anon unexpectedly has child-directory SELECT';
  end if;
end;
$$;

insert into public.organizations (id, name, timezone, currency, demo_only)
values (
  '11111111-1111-4111-8111-111111111112',
  'Cross Tenant Synthetic Centre',
  'America/Toronto',
  'CAD',
  true
);
insert into public.locations (id, organization_id, name, timezone)
values (
  '22222222-2222-4222-8222-222222222223',
  '11111111-1111-4111-8111-111111111112',
  'Other Synthetic Location',
  'America/Toronto'
);
insert into public.children (id, organization_id, location_id, display_name)
values (
  '33333333-3333-4333-8333-333333333339',
  '11111111-1111-4111-8111-111111111112',
  '22222222-2222-4222-8222-222222222223',
  'Cross Tenant Synthetic Child'
);
insert into public.incidents (
  id,
  organization_id,
  location_id,
  child_id,
  facts,
  occurred_at,
  created_by
)
values (
  'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee1',
  '11111111-1111-4111-8111-111111111111',
  '22222222-2222-4222-8222-222222222222',
  '33333333-3333-4333-8333-333333333331',
  '{"category":"synthetic_demo"}',
  '2026-08-14T15:18:00Z',
  '77777777-7777-4777-8777-777777777771'
);
insert into public.audit_events (
  id,
  organization_id,
  actor_id,
  request_id,
  event_type,
  entity_type,
  result_class
)
values (
  'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee2',
  '11111111-1111-4111-8111-111111111111',
  '77777777-7777-4777-8777-777777777771',
  'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee3',
  'synthetic_test',
  'test',
  'allowed'
);

set local role authenticated;
select set_config('request.jwt.claim.sub', '77777777-7777-4777-8777-777777777773', true);
select set_config(
  'request.jwt.claims',
  '{"sub":"77777777-7777-4777-8777-777777777773","role":"authenticated"}',
  true
);
do $$
declare
  child_count integer;
  invoice_count integer;
  incident_count integer;
begin
  select count(*) into child_count from public.children;
  select count(*) into invoice_count from public.invoices;
  select count(*) into incident_count from public.incidents;
  if child_count <> 1 then
    raise exception 'Guardian child scope failed: %', child_count;
  end if;
  if invoice_count <> 1 then
    raise exception 'Guardian invoice relationship scope failed: %', invoice_count;
  end if;
  if incident_count <> 0 then
    raise exception 'Guardian reached restricted incidents: %', incident_count;
  end if;
end;
$$;

reset role;
set local role authenticated;
select set_config('request.jwt.claim.sub', '77777777-7777-4777-8777-777777777772', true);
select set_config(
  'request.jwt.claims',
  '{"sub":"77777777-7777-4777-8777-777777777772","role":"authenticated"}',
  true
);
do $$
declare
  child_count integer;
  invoice_count integer;
begin
  select count(*) into child_count from public.children;
  select count(*) into invoice_count from public.invoices;
  if child_count <> 4 then
    raise exception 'Assigned educator scope failed: %', child_count;
  end if;
  if invoice_count <> 0 then
    raise exception 'Educator reached billing records: %', invoice_count;
  end if;
end;
$$;

reset role;
set local role authenticated;
select set_config('request.jwt.claim.sub', '77777777-7777-4777-8777-777777777771', true);
select set_config(
  'request.jwt.claims',
  '{"sub":"77777777-7777-4777-8777-777777777771","role":"authenticated"}',
  true
);
do $$
declare
  child_count integer;
  incident_count integer;
  rejected boolean := false;
begin
  select count(*) into child_count from public.children;
  select count(*) into incident_count from public.incidents;
  if child_count <> 4 then
    raise exception 'Director tenant isolation failed: %', child_count;
  end if;
  if incident_count <> 1 then
    raise exception 'Director restricted incident scope failed: %', incident_count;
  end if;
  begin
    update public.invoices
    set total_minor = total_minor + 1
    where id = '55555555-5555-4555-8555-555555555551';
  exception
    when others then
      rejected := true;
  end;
  if not rejected then
    raise exception 'Issued invoice mutation was not rejected';
  end if;
end;
$$;

reset role;
do $$
declare
  rejected boolean := false;
begin
  begin
    update public.audit_events
    set result_class = 'changed'
    where id = 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee2';
  exception
    when others then
      rejected := true;
  end;
  if not rejected then
    raise exception 'Audit event mutation was not rejected';
  end if;
end;
$$;

rollback;

\echo 'Live RLS and immutability probes passed.'
