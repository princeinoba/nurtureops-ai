# Source inventory

This register records the material supplied for the 2026-08-15 clean-room rebuild. ZIP contents remain in the ignored read-only evidence area `.evidence/archives/`; no archive, embedded Git directory, dependency tree, build output, credential, or source file was copied into the application.

## Archive integrity

| Supplied file                             |       Bytes | SHA-256                                                            | Entries | Uncompressed bytes | Embedded Git                                                                               |
| ----------------------------------------- | ----------: | ------------------------------------------------------------------ | ------: | -----------------: | ------------------------------------------------------------------------------------------ |
| `ai.zip` (manifest calls it `ai(10).zip`) | 355,515,862 | `ffaa74d14f617cc5311bd57f2d0d9fe06673f74fe6e127f2de78134553b4e34d` |   8,580 |        396,775,542 | `vercel/ai`, `main`, `a56fbc08fd5c171574a499babfbd82f0b2a7b3fe`, clean                     |
| `folk-care.zip`                           |  80,648,627 | `d074e4552ec0de494b02b0c527dc9b8b6e2d959a2b1eb110cb8e3a5a19a82866` |   2,428 |         94,083,191 | `neighborhood-lab/folk-care`, `develop`, `2083a67db804a0fe6ccfc37e3bcd4a98c630d854`, clean |
| `nannybill.zip`                           |     199,750 | `79025aee0e27999b6a41ffb47d12ee2352132283d03de8e3c49f0f07d53c0e68` |      81 |            410,277 | `olamide226/nannybill`, `main`, `e5f441902a35fb784daab8b8ee59c43caf3f12ef`, clean          |

The two supplied master-prompt files are byte-identical: 38,464 bytes and SHA-256 `db348d488b19ddec283b8c09627229d97595f601808374631f9472d78ba41d48`. One canonical copy is preserved under `docs/source-evidence/`.

The supplied delivery manifest validates all three archives and six listed audit documents. It also lists `codex-daycare-ai-clean-room-rebuild-vercel-prompt.md` and `official-current-platform-references.md`, which were not supplied. They were not invented or treated as reviewed evidence.

## Direct observations

### Vercel AI SDK archive

- Published package manifest: `ai` 7.0.42, Apache-2.0.
- Large TypeScript monorepo with providers, examples, tests, and generated/build concerns.
- Current archive pattern centralizes approval in `toolApproval`.
- Used only as architecture and API evidence. The implementation installs published `ai` 7.0.66.

### Folk Care archive

- Manifest: `@folkcare/platform` 0.1.0, AGPL-3.0.
- React/Express application with a broad childcare feature vocabulary.
- Direct review found mock-header authorization paths, browser-adjacent data risks, and conflicting README licence text.
- Used only for conceptual coverage comparison; all implementation code and visual design are new.

### NannyBill archive

- Manifest: `nannybill` 0.0.0, no declared package licence and no licence file; README says MIT.
- Vite/React client using `@libsql/client`, browser-local auth/data access, browser migrations/reset, bank environment names, and SQL `REAL` money.
- Used only to identify billing concepts and failure modes. No code, schema, branding, or assets were reused.

## Sensitive-data and secret review

A redacted scan covered service-role/provider tokens, private keys, database URLs, bank values, personal email/phone/address patterns, and child/family records. No high-confidence live secret or real child/family dataset was found. Apparent `sk-` matches were path fragments or encrypted test fixtures. NannyBill bank fields were placeholders, not live values.

The clean application uses only reserved `@synthetic.invalid` identities, fictional records, integer minor-unit money, and server-only secret names.
