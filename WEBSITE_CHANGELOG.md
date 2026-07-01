# Website Changelog

## 2026-06-17 23:05 CST - Dedicated 9router Worker

Scope:
- Moved `9router.space` and `www.9router.space` out of the shared `my-9router` Worker.
- Kept MiroFish routes untouched.

Touched files:
- `.gitignore`
- `package.json`
- `worker/standalone.js`
- `wrangler.9router.toml`
- `wrangler.worker.toml`

Changes:
- Added a dedicated Cloudflare Worker entry for the 9router domain.
- Removed the 9router production routes from the shared Worker config.
- Added strict static-path handling so unrelated shared-worker round paths return 404 with `X-Robots-Tag: noindex, nofollow`.
- Added checkout redirects for pricing and success paths while keeping the Creem API path separate.

Verification:
- Deployed `nine-router-space` to Cloudflare Workers.
- Verified the apex route, checkout redirects, runtime endpoint, and noindex 404 behavior on production.
- Current payment blocker: no Creem secret is configured on the dedicated Worker.

## 2026-06-16 10:41 CST - Daily SEO/GEO Content Reinforcement

Scope:
- Strengthened the local 9router Space SEO/GEO surface for the daily A-site queue.
- Focused on the primary intent `9router AI router` and related Codex, Cursor, Antigravity, fallback, quota, token, Docker, and npm buyer questions.

Touched files:
- `src/App.tsx`
- `src/lib/seo.ts`
- `src/content/keyword-pages.ts`
- `public/llms.txt`
- `public/sitemap.xml`

Changes:
- Updated default title and description toward AI-router and fallback intent.
- Rewrote the homepage first-fold promise around Codex, Cursor, Antigravity, model fallback, quota control, and token savings.
- Added a homepage search-intent section for provider fallback, token savings, and operational guardrails.
- Expanded `/9router-ai` with answer-engine targeting, internal page cluster guidance, and FAQ coverage.
- Refreshed `llms.txt` and `sitemap.xml` so search and answer engines can discover the current keyword pages.

Verification:
- Pending local build after the daily portfolio report is generated.

Deploy/Git status:
- Local code changed only.
- Not committed, pushed, or deployed.

## 2026-06-14 17:05 CST - GSC Mail Indexing Follow-Up

Scope:
- Followed recent Google Search Console email feedback for managed `*.clauxel.com` and shared-router sites reporting indexing, robots, noindex, and canonicalization signals.
- Kept MiroFish domains untouched.

Touched files:
- `worker/index.js`
- `scripts/postbuild.mjs`

Changes:
- Updated managed-site `robots.txt` generation so only `/api/` is blocked by robots. Checkout and success pages are no longer robots-blocked, allowing their own noindex/404 handling to be seen by crawlers instead of producing robots-blocked GSC noise.
- Kept managed sitemap normalization excluding `/api/`, checkout, success, `.well-known`, and non-HTML asset paths.
- Made `postbuild` skip missing external static-site source directories with a warning instead of failing the whole build in incomplete source mirrors.

Verification:
- `npm install` completed for the local mirror.
- `npm run build` completed after the postbuild missing-source guard.
- `git diff --check` passed for changed files.
- Public read-only checks before the code change showed current homepages and sitemap URLs are generally indexable; the code change addresses robots-blocked recurrence from shared managed-site robots rules.

Deploy/Git status:
- Local code changed only.
- Not committed, pushed, or deployed.

Follow-ups:
- Deploy the shared Worker after Owner approval so live managed-site robots output reflects this change.
- For standalone sites whose production source is not present in this mirror, fetch the correct source before editing or deploying.

## 2026-07-01 - MiroFish contextual reference

- Added one contextual related-resource link to MiroFish AI Simulator with UTM tracking for 9router.space.
- Placement rule: secondary Resources/Source context when available, otherwise the homepage tail; no hero, nav, pricing, checkout, or primary CTA links were changed.
- SEO safety: brand anchor only, one link per canonical site surface, visible editorial context, and no keyword-stuffed footer/sitewide block.
- Verification pending: run the site build/deploy workflow and live link checks after all portfolio edits are applied.
