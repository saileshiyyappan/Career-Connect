# CareerConnect API Refresh Dry Run

Date: 2026-10-14

Target: `careerconnect-2525` (real Firebase project; no emulator variables were configured). No staging/production label is present in the repository, so this report does not classify the project as either.

## Firestore inventory

Read with the Admin SDK using paginated reads ordered by document ID. No personal fields, secrets, titles, or descriptions were printed.

| Collection | Pages | Documents | Provider/source groups |
|---|---:|---:|---|
| `external_jobs` | 4 | 80 | `himalayas`: 80 |
| `career_news` | 6 | 132 | `wired_work`: 20; `economic_times_jobs`: 50; `times_of_india_careers`: 20; `devto_careers`: 12; `techcrunch_enterprise`: 20; `freecodecamp_careers`: 10 |

All existing records have string `createdAt`, `updatedAt`, `fetchedAt`, and `publishedAt` values. Existing job records contain the normalized external-job schema (`sourceId`, `externalId`, `sourceUrl`, `jobOrigin`, `contentHash`, status, and normalized job fields). Existing news records contain the normalized news schema (`sourceId`, `sourceUrl`, `contentHash`, status, category, timestamps, and normalized article fields).

Representative deterministic document IDs were observed, including job IDs `00772c881f6e0950166374e8649c5ad3ac1ef865e78f55e08632828a5db4b80b` and news IDs `00bd7183648ee1f39e345be3b3f6b986e7ae1ee22f53921a194a101824fef746`. IDs are hash-like and source-scoped.

## Classification

- Adzuna imports: 0 existing records.
- NewsAPI imports: 0 existing records.
- Other external feeds: 80 Himalayas jobs and 132 RSS news records.
- Seeded/demo records: 0 identified from the stored provider metadata and normalized schemas.
- Ambiguous records: 0; every record had a recognized `sourceId` matching an existing configured feed.

The existing `job_sources` collection contains only enabled `himalayas`. The existing `news_sources` collection contains the six RSS source IDs listed above. Adzuna and NewsAPI are present in code defaults but are not yet stored as source documents.

## Fresh API dry run

Exactly one request was made to each provider and processed with the existing parser/normalizer classes.

| Provider | HTTP/API result | Fetched | Valid | Rejected | Duplicates |
|---|---|---:|---:|---:|---:|
| Adzuna (`adzuna_us`) | HTTP 200 | 20 | 20 | 0 | 0 |
| NewsAPI (`newsapi`) | HTTP 200, `status=ok` | 16 | 16 | 0 | 0 |

The initial dry run found no duplicate IDs or content hashes within either fresh result set. Because the existing collections contained no `adzuna_us` or `newsapi` records, the proposed refresh had no provider-specific replacements.

## Dry-run operation plan

| Collection | Retain | Replace/update | Proposed insert | Proposed remove |
|---|---:|---:|---:|---:|
| `external_jobs` | 80 | 0 | 20 Adzuna | 0 |
| `career_news` | 132 | 0 | 16 NewsAPI in the dry run | 0 |

The safest operation is an additive provider sync through the existing aggregation services, followed by a read-back query. Existing Himalayas/RSS records should remain untouched. No records in `jobs`, `applications`, `users`, `companies`, `saved_jobs`, `notifications`, or unrelated collections are in scope.

## Authorized additive sync result

The provider-specific existing aggregation services were executed after the dry run. No deletes were issued.

- Adzuna: first attempt exposed and fixed an optional-field persistence defect; retry succeeded with 20 fetched and 20 inserted.
- NewsAPI: first attempt fetched 29, inserted 28, and rejected one missing optional thumbnail; after the normalizer fix, one additional article was inserted and the next run reported 29 duplicates. Final read-back: 29 `newsapi` documents.
- Final read-back: 100 `external_jobs` documents (80 Himalayas, 20 Adzuna) and 161 `career_news` documents (132 existing RSS, 29 NewsAPI).
- Final provider records with missing required normalized fields: 0.
- Source metadata now includes `adzuna_us`, `newsapi`, and the existing sources. The default disabled `jobicy` source metadata was also created by the existing bootstrap path; no job, news, user, or internal employer data was changed.

The first failed attempts left only sync-log entries and partial source metadata; the source bootstrap repair preserved existing status/timestamps and backfilled missing provider configuration. No failed Adzuna documents were persisted.

## Code and UI verification

Adzuna and NewsAPI are wired into `JobAggregationService` and `NewsAggregationService`, the scheduled functions, and the admin-only manual sync callables. The existing parser/normalizer pipeline successfully processed the fresh responses.

The local application was already running on port 3000. HTTP smoke checks returned 200 for `/`, `/jobs`, and `/news`. Browser-level rendered-record verification was not performed because no browser automation tool was available; the saved Firestore records were verified through Admin SDK read-back instead.

Build/test verification:

- Root lint: passed.
- Root production build: passed.
- Functions TypeScript build: passed.
- Functions live test runner: 18/20 live checks passed. NewsAPI and TechCrunch live-feed checks were transient network failures in this run; the fallback TypeScript runner is unavailable because `ts-node` and `functions/test/runner.mjs` are not installed.
- Final Firestore read-back: Adzuna 20 records and NewsAPI 29 records, with all required normalized fields present.

## Safety status

Writes: additive provider records and source/sync metadata only. Deletes: 0. Deployments: 0. Firestore rules changes: 0.

Destructive cleanup remains blocked and is not part of this stage. Any future cleanup requires an explicit provider-scoped retention policy and a reviewed authorized execution against the confirmed project.
