# 9router Space

Conversion-focused SaaS site for `9router.space`, built with Vite, React, Cloudflare Workers, Cloudflare Pages, and Creem hosted checkout.

## What is included

- Interactive first-screen 9router route planner for Codex, Cursor, Antigravity, Claude Code, fallback tiers, token policy, and deployment shape.
- Useful inner pages for 9router GitHub, Docker, npm, install, AI routing, Codex, Antigravity, and Cursor search intent.
- Pricing with Pro annual selected by default and annual billing 50% cheaper than monthly.
- Centered Creem popup checkout that leaves the original page visible behind a blurred overlay.
- Cloudflare Worker API for runtime, analytics, sitemap, robots, and checkout.
- Cloudflare Pages compatible static build and Pages Functions API fallback.
- GitHub Actions workflows for automatic Cloudflare Workers and Pages deploys.

## Commands

```bash
npm install
npm run build
npm run cloudflare:deploy
npm run pages:deploy
```

## Payment

The production payment secret is expected as `API_PROD_KEY` in Cloudflare. Do not commit payment keys or account credentials.
