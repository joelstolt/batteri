# Batteriproffs order fixes and design review

Updated 2026-09-05. Approved plan: the user said "kör på". Base: main 7defa29. Isolated branch fix/order-integrity-20260904.

Implemented: complete versioned order items with backward-compatible readers; capture-aware verified order API; authoritative checkout quote and idempotent requests; stale-response/unmounted-checkout guards; persistent cart association and storage refresh; verified thank-you page and conversion guards; retryable webhook failures with per-recipient receipts and Resend idempotency; VAT consistency; dependency updates and regression tests.

Validation: 93 tests passing (including the 49 earlier payment/order regressions); build passing; ESLint no errors or warnings; pnpm audit and pnpm audit --prod report zero known vulnerabilities. Next 16.3.4, React 19.2.8, Sanity 5.31.2, next-sanity 12.4.5, @sanity/client 7.27.0. The next-sanity v12 deprecation concerns SanityLive/defineLive, which this app does not use. Three targeted transitive overrides: js-yaml, uuid, adm-zip. Stale package-lock removed; pnpm-lock is authoritative.

Review environment: dedicated Vercel project batteriproffs-kodgranskning-20260904, project id prj_RhRc6AW62J7dGFSxQQvgMJxyNWtF. Public review alias https://batteriproffs-kodgranskning-2026090.vercel.app . BP_REVIEW_PREVIEW=1, dummy credentials only, no public Stripe key; APIs and Studio blocked, analytics/chat disabled, noindex. Cron omitted through ../vercel-review.json. This is NOT the existing batteri Vercel project.

Design preview: https://batteriproffs-design-v2-20260904.joel-d77.workers.dev . Separate homepage, NM125-6ET product page, refined B logo, profile and SVG/PNG masters. Responsive browser checks passed at desktop, 390px and 320px; VAT/search/demo cart checked.

Not performed: actual Stripe test authorization/capture, real outgoing email, production release, push to main. No test keys or approved test recipient were available. Before releasing payment changes: run Stripe test-mode E2E and verify actual mail delivery in Resend with an approved test recipient. Unknown sends older than the 23h retry margin must be reconciled in Resend before any fresh send. Legacy missing order rows cannot be reconstructed automatically.

2026-09-05 continuation: B2B improvements and manufacturer product research are documented in B2B-RESULTAT.md. Design v3 remains paused and unchanged. Review project only; no main push.
