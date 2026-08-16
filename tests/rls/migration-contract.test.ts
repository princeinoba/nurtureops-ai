import { readFileSync } from "node:fs";
import { join } from "node:path";

const migration = readFileSync(
  join(process.cwd(), "supabase", "migrations", "20260815031920_initial_nurtureops_schema.sql"),
  "utf8",
);
const seed = readFileSync(join(process.cwd(), "supabase", "seed.sql"), "utf8");
const tables = [...migration.matchAll(/create table public\.([a-z_]+)/g)].map((match) => match[1]);
const rlsListStart = migration.indexOf("foreach target_table in array array[");
const rlsListEnd = migration.indexOf("  loop", rlsListStart);
const rlsTableList = migration.slice(rlsListStart, rlsListEnd);

describe("Supabase authorization contract", () => {
  it("forces RLS on every public application table", () => {
    expect(tables.length).toBeGreaterThan(50);
    expect(migration).toContain("alter table public.%I enable row level security");
    expect(migration).toContain("alter table public.%I force row level security");
    for (const table of tables) {
      expect(rlsTableList).toContain(`'${table}'`);
    }
  });

  it("starts from revoked Data API privileges and uses explicit grants", () => {
    expect(migration).toContain(
      "revoke all on all tables in schema public from anon, authenticated;",
    );
    expect(migration).toMatch(
      /grant select on public\.organizations,[\s\S]*public\.children,[\s\S]*to authenticated;/,
    );
    expect(migration).not.toMatch(/grant all.+to authenticated/i);
  });

  it("hardens definer helpers and invoice/audit history", () => {
    expect(
      [...migration.matchAll(/security definer\s+set search_path = ''/g)].length,
    ).toBeGreaterThan(5);
    expect(migration).toContain("create trigger invoices_valid_transition");
    expect(migration).toContain("create trigger audit_events_immutable");
    expect(migration).toContain("create trigger invoice_lines_immutable_after_issue");
  });

  it("keeps storage private and guardian access relationship-scoped", () => {
    expect(migration).toMatch(
      /insert into storage\.buckets[\s\S]*'nurtureops-private',[\s\S]*false,/,
    );
    expect(migration).toContain("private.guardian_has_child_access");
    expect(migration).toContain("private.can_access_invoice");
  });

  it("contains synthetic-only local seed identities", () => {
    expect(seed).toContain("@synthetic.invalid");
    expect(seed).not.toMatch(/@(gmail|outlook|hotmail|yahoo)\./i);
    expect(migration.trimEnd().endsWith("commit;")).toBe(true);
  });
});
