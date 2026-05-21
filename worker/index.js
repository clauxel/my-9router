import { handleAnalyticsRequest } from './analytics.js'
import { handleNowPaymentsCheckout } from './nowpayments.js'
import { handleRequest as handleRound18Webmcpactionreceipt } from './round18/webmcpactionreceipt/index.js'
import { handleRequest as handleRound18Aistudioworkspaceapproval } from './round18/aistudioworkspaceapproval/index.js'
import { handleRequest as handleRound18Agentskillupdategate } from './round18/agentskillupdategate/index.js'
import { handleRequest as handleRound18Opendesignguard } from './round18/opendesignguard/index.js'
import { handleRequest as handleRound18Veocreditwaste } from './round18/veocreditwaste/index.js'
import { handleRequest as handleRound18Speckitacceptance } from './round18/speckitacceptance/index.js'
import { handleRequest as handleRound18Semblecodesearchgate } from './round18/semblecodesearchgate/index.js'
import { handleRequest as handleRound18Agentichtmlexportqa } from './round18/agentichtmlexportqa/index.js'
import { handleRequest as handleRound18Geminisparktaskboard } from './round18/geminisparktaskboard/index.js'
import { handleRequest as handleRound18Antigravityextensiongate } from './round18/antigravityextensiongate/index.js'
import { handleRequest as handleRound22Codegraphcontext } from './round22/codegraphcontext/index.js'
import { handleRequest as handleRound22Openlitops } from './round22/openlitops/index.js'
import { handleRequest as handleRound22Bifrostgateway } from './round22/bifrostgateway/index.js'
import { handleRequest as handleRound22Fastmcpruntime } from './round22/fastmcpruntime/index.js'
import { handleRequest as handleRound22Agentmemorymcp } from './round22/agentmemorymcp/index.js'
import { handleRequest as handleRound22Cozeloopops } from './round22/cozeloopops/index.js'
import { handleRequest as handleRound22Pydanticcontract } from './round22/pydanticcontract/index.js'
import { handleRequest as handleRound22Clianythingharness } from './round22/clianythingharness/index.js'
import { handleRequest as handleRound22Hermesagentrun } from './round22/hermesagentrun/index.js'
import { handleRequest as handleRound22Mastraworkflow } from './round22/mastraworkflow/index.js'

const LIVE_ORIGIN = 'https://9router.space'
const LIVE_HOST = '9router.space'
const ALT_HOSTS = new Set(['www.9router.space'])
const ANNUAL_DISCOUNT_MULTIPLIER = 0.5

const round18Sites = new Map([
  ['webmcpactionreceipt.clauxel.com', { project: 'webmcpactionreceipt', handler: handleRound18Webmcpactionreceipt }],
  ['aistudioworkspaceapproval.clauxel.com', { project: 'aistudioworkspaceapproval', handler: handleRound18Aistudioworkspaceapproval }],
  ['agentskillupdategate.clauxel.com', { project: 'agentskillupdategate', handler: handleRound18Agentskillupdategate }],
  ['opendesignguard.clauxel.com', { project: 'opendesignguard', handler: handleRound18Opendesignguard }],
  ['veocreditwaste.clauxel.com', { project: 'veocreditwaste', handler: handleRound18Veocreditwaste }],
  ['speckitacceptance.clauxel.com', { project: 'speckitacceptance', handler: handleRound18Speckitacceptance }],
  ['semblecodesearchgate.clauxel.com', { project: 'semblecodesearchgate', handler: handleRound18Semblecodesearchgate }],
  ['agentichtmlexportqa.clauxel.com', { project: 'agentichtmlexportqa', handler: handleRound18Agentichtmlexportqa }],
  ['geminisparktaskboard.space', { project: 'geminisparktaskboard', handler: handleRound18Geminisparktaskboard }],
  ['www.geminisparktaskboard.space', { project: 'geminisparktaskboard', handler: handleRound18Geminisparktaskboard }],
  ['antigravityextensiongate.clauxel.com', { project: 'antigravityextensiongate', handler: handleRound18Antigravityextensiongate }],
])

const round22Sites = new Map([
  ['codegraphcontext.clauxel.com', { project: 'codegraphcontext', handler: handleRound22Codegraphcontext }],
  ['openlitops.space', { project: 'openlitops', handler: handleRound22Openlitops }],
  ['www.openlitops.space', { project: 'openlitops', handler: handleRound22Openlitops }],
  ['bifrostgateway.space', { project: 'bifrostgateway', handler: handleRound22Bifrostgateway }],
  ['www.bifrostgateway.space', { project: 'bifrostgateway', handler: handleRound22Bifrostgateway }],
  ['fastmcpruntime.clauxel.com', { project: 'fastmcpruntime', handler: handleRound22Fastmcpruntime }],
  ['agentmemorymcp.clauxel.com', { project: 'agentmemorymcp', handler: handleRound22Agentmemorymcp }],
  ['cozeloopops.space', { project: 'cozeloopops', handler: handleRound22Cozeloopops }],
  ['www.cozeloopops.space', { project: 'cozeloopops', handler: handleRound22Cozeloopops }],
  ['pydanticcontract.clauxel.com', { project: 'pydanticcontract', handler: handleRound22Pydanticcontract }],
  ['clianythingharness.clauxel.com', { project: 'clianythingharness', handler: handleRound22Clianythingharness }],
  ['hermesagentrun.space', { project: 'hermesagentrun', handler: handleRound22Hermesagentrun }],
  ['www.hermesagentrun.space', { project: 'hermesagentrun', handler: handleRound22Hermesagentrun }],
  ['mastraworkflow.space', { project: 'mastraworkflow', handler: handleRound22Mastraworkflow }],
  ['www.mastraworkflow.space', { project: 'mastraworkflow', handler: handleRound22Mastraworkflow }],
])

const creemProductCache = new Map()

const planCatalog = {
  starter: {
    id: 'starter',
    name: 'Starter',
    monthlyAmountCents: 2900,
    currency: 'USD',
    summary: 'one-operator 9router setup',
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    monthlyAmountCents: 9900,
    currency: 'USD',
    summary: 'default managed 9router team rollout',
  },
  ops: {
    id: 'ops',
    name: 'Operations',
    monthlyAmountCents: 24900,
    currency: 'USD',
    summary: 'secured endpoint and provider governance rollout',
  },
}

const indexablePaths = [
  '/',
  '/9router-github',
  '/9router-docker',
  '/9router-npm',
  '/9router-install',
  '/9router-ai',
  '/9router-codex',
  '/9router-antigravity',
  '/9router-cursor',
  '/pricing',
  '/privacy',
  '/terms',
]

const staticAssetPaths = new Set([...indexablePaths, '/checkout/done'])

function securityHeaders(request) {
  const headers = new Headers({
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  })

  const origin = request?.headers?.get?.('Origin')
  if (isAllowedCorsOrigin(origin)) {
    headers.set('Access-Control-Allow-Origin', origin)
    headers.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    headers.set('Access-Control-Allow-Headers', 'Content-Type')
    headers.set('Vary', 'Origin')
  }

  return headers
}

function isAllowedCorsOrigin(origin) {
  if (!origin) return false

  try {
    const url = new URL(origin)
    if (url.hostname === LIVE_HOST || ALT_HOSTS.has(url.hostname)) return true
    if (url.hostname.endsWith('.pages.dev') || url.hostname.endsWith('.workers.dev')) return true
    if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') return true
  } catch {}

  return false
}

function jsonResponse(data, status = 200, request = null) {
  const headers = securityHeaders(request)
  headers.set('Content-Type', 'application/json; charset=utf-8')
  return new Response(JSON.stringify(data), { status, headers })
}

function round18Env(env, project) {
  return {
    ...env,
    ASSETS: {
      fetch(assetRequest) {
        if (!env?.SITE_ASSETS?.fetch) {
          return new Response('Cloudflare asset binding is unavailable.', { status: 500 })
        }
        const assetUrl = new URL(assetRequest.url)
        assetUrl.pathname = assetUrl.pathname === '/'
          ? `/_round18/${project}/index.html`
          : `/_round18/${project}${assetUrl.pathname}`
        return env.SITE_ASSETS.fetch(new Request(assetUrl.toString(), {
          method: assetRequest.method,
          headers: assetRequest.headers,
        }))
      },
    },
  }
}

function contentTypeForPath(pathname) {
  const lower = pathname.toLowerCase()
  if (lower.endsWith('.html')) return 'text/html; charset=utf-8'
  if (lower.endsWith('.css')) return 'text/css; charset=utf-8'
  if (lower.endsWith('.js')) return 'text/javascript; charset=utf-8'
  if (lower.endsWith('.json')) return 'application/json; charset=utf-8'
  if (lower.endsWith('.txt')) return 'text/plain; charset=utf-8'
  if (lower.endsWith('.xml')) return 'application/xml; charset=utf-8'
  if (lower.endsWith('.svg')) return 'image/svg+xml'
  if (lower.endsWith('.png')) return 'image/png'
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg'
  if (lower.endsWith('.webp')) return 'image/webp'
  if (lower.endsWith('.ico')) return 'image/x-icon'
  return 'application/octet-stream'
}

function r2Bucket(env) {
  return env?.SITE_BUCKET || env?.SITE_R2 || env?.ROUTER_SITES || null
}

async function fetchRoundSiteAsset(assetRequest, env, roundPrefix, project) {
  const assetUrl = new URL(assetRequest.url)
  const pathname = assetUrl.pathname === '/' ? '/index.html' : assetUrl.pathname
  const key = `${roundPrefix}/${project}${pathname}`
  const bucket = r2Bucket(env)

  if (bucket?.get) {
    const object = await bucket.get(key)
    if (object) {
      const headers = new Headers()
      object.writeHttpMetadata?.(headers)
      if (!headers.has('Content-Type')) headers.set('Content-Type', contentTypeForPath(pathname))
      headers.set('ETag', object.httpEtag)
      headers.set('Cache-Control', pathname.endsWith('.html') ? 'public, max-age=120' : 'public, max-age=31536000, immutable')
      return new Response(object.body, { status: 200, headers })
    }
  }

  if (!env?.SITE_ASSETS?.fetch) {
    return new Response('Static assets are not bound for this deployment.', { status: 503 })
  }

  const fallbackUrl = new URL(assetRequest.url)
  fallbackUrl.pathname = `/${roundPrefix}/${project}${pathname}`
  return env.SITE_ASSETS.fetch(new Request(fallbackUrl.toString(), {
    method: assetRequest.method,
    headers: assetRequest.headers,
  }))
}

function roundSiteEnv(env, roundPrefix, project) {
  return {
    ...env,
    ASSETS: {
      fetch(assetRequest) {
        return fetchRoundSiteAsset(assetRequest, env, roundPrefix, project)
      },
    },
  }
}

async function handleRound18Proof(request, env, project) {
  const requestUrl = new URL(request.url)
  if (requestUrl.pathname !== '/.well-known/mcp-registry-auth') return null
  if (!env?.SITE_ASSETS?.fetch) {
    return new Response('Cloudflare asset binding is unavailable.', { status: 500 })
  }

  const assetUrl = new URL(request.url)
  assetUrl.pathname = `/_round18/${project}/.well-known/mcp-registry-auth`
  const assetResponse = await env.SITE_ASSETS.fetch(new Request(assetUrl.toString(), {
    method: 'GET',
    headers: request.headers,
  }))

  if (assetResponse.status !== 200) return assetResponse
  return new Response(assetResponse.body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}

async function handleRoundSiteProof(request, env, roundPrefix, project) {
  const requestUrl = new URL(request.url)
  if (requestUrl.pathname !== '/.well-known/mcp-registry-auth') return null

  const key = `${roundPrefix}/${project}/.well-known/mcp-registry-auth`
  const bucket = r2Bucket(env)
  if (bucket?.get) {
    const object = await bucket.get(key)
    if (object) {
      return new Response(object.body, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-store',
          'X-Content-Type-Options': 'nosniff',
        },
      })
    }
  }

  if (!env?.SITE_ASSETS?.fetch) {
    return new Response('Cloudflare asset binding is unavailable.', { status: 500 })
  }

  const assetUrl = new URL(request.url)
  assetUrl.pathname = `/${key}`
  const assetResponse = await env.SITE_ASSETS.fetch(new Request(assetUrl.toString(), {
    method: 'GET',
    headers: request.headers,
  }))
  const body = await assetResponse.text()
  if (assetResponse.status !== 200 || !body.trim().startsWith('v=MCPv1;')) {
    return new Response('MCP registry proof is not available for this site.', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  }

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}

function handleOptions(request) {
  return new Response(null, { status: 204, headers: securityHeaders(request) })
}

function maybeRedirectToHttps(requestUrl) {
  if (requestUrl.hostname === LIVE_HOST || ALT_HOSTS.has(requestUrl.hostname)) {
    if (requestUrl.protocol !== 'https:' || requestUrl.hostname !== LIVE_HOST) {
      const redirectUrl = new URL(requestUrl)
      redirectUrl.protocol = 'https:'
      redirectUrl.hostname = LIVE_HOST
      return Response.redirect(redirectUrl.toString(), 301)
    }
  }
  return null
}

function resolvePublicAppOrigin(requestUrl) {
  if (requestUrl.hostname === LIVE_HOST || ALT_HOSTS.has(requestUrl.hostname)) {
    return `https://${requestUrl.hostname}`
  }

  if (requestUrl.hostname.endsWith('.pages.dev') || requestUrl.hostname.endsWith('.workers.dev')) {
    return requestUrl.origin
  }

  return LIVE_ORIGIN
}

function resolveCreemBase(env) {
  const raw = String(env?.CREEM_API_BASE ?? '').trim()
  return raw ? raw.replace(/\/+$/, '') : 'https://api.creem.io'
}

async function getSecretValue(value) {
  if (typeof value === 'string') return value.trim()
  if (value && typeof value.get === 'function') {
    const resolved = await value.get()
    return typeof resolved === 'string' ? resolved.trim() : ''
  }
  return ''
}

async function firstSecretEnv(env, ...keys) {
  for (const key of keys) {
    const value = await getSecretValue(env?.[key])
    if (value) return value
  }
  return ''
}

function normalizeEnvKey(value) {
  return String(value)
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

function formatMoney(amountCents, currency) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: amountCents % 100 === 0 ? 0 : 2,
  }).format(amountCents / 100)
}

function resolveConfiguredProductId(env, planId, billing) {
  const cycle = billing === 'monthly' ? 'MONTHLY' : 'YEARLY'
  const tier = planId === 'ops' ? 'OPS' : planId === 'starter' ? 'STARTER' : 'PRO'
  const normalizedSelection = normalizeEnvKey(`${planId}_${billing}`)
  const keys = [
    `CREEM_PRODUCT_${tier}_${cycle}`,
    `CREEM_PRODUCT_ID_9ROUTER_${normalizedSelection}`,
    `CREEM_PRODUCT_ID_${normalizedSelection}`,
    `CREEM_PRODUCT_ID_${tier}`,
    'CREEM_PRODUCT_ID',
  ]

  for (const key of keys) {
    const value = env?.[key]
    if (typeof value === 'string' && value.trim()) return value.trim()
  }
  return ''
}

async function requestCreemJson(apiKey, url, body) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify(body),
  })

  const rawText = await response.text()
  let payload = null
  if (rawText) {
    try {
      payload = JSON.parse(rawText)
    } catch {
      payload = null
    }
  }

  if (!response.ok) {
    throw new Error(
      payload && typeof payload === 'object'
        ? payload.message || payload.error || 'Creem request failed.'
        : 'Creem request failed.',
    )
  }

  return payload || {}
}

async function getOrCreateCreemProduct(env, apiKey, plan, billing, successUrl) {
  const configuredProductId = resolveConfiguredProductId(env, plan.id, billing)
  if (configuredProductId) return configuredProductId

  const cacheKey = `${plan.id}:${billing}`
  if (creemProductCache.has(cacheKey)) return creemProductCache.get(cacheKey)

  const monthlyAmountCents =
    billing === 'annual' ? Math.round(plan.monthlyAmountCents * ANNUAL_DISCOUNT_MULTIPLIER) : plan.monthlyAmountCents
  const totalAmountCents = billing === 'annual' ? monthlyAmountCents * 12 : monthlyAmountCents
  const billingLabel = billing === 'annual' ? 'annual' : 'monthly'

  const product = await requestCreemJson(apiKey, `${resolveCreemBase(env)}/v1/products`, {
    name: `9router Space ${plan.name} (${billingLabel})`,
    description: `${formatMoney(monthlyAmountCents, plan.currency)}/mo - ${plan.summary}`,
    price: totalAmountCents,
    currency: plan.currency,
    billing_type: 'onetime',
    tax_mode: 'inclusive',
    tax_category: 'saas',
    default_success_url: successUrl,
  })

  const productId = product.id || product.product_id
  if (!productId) throw new Error('Creem did not return a product id.')

  creemProductCache.set(cacheKey, productId)
  return productId
}

function extractCheckoutUrl(payload) {
  const candidates = [payload?.checkout_url, payload?.checkoutUrl, payload?.url]
  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim()) return candidate.trim()
  }
  return ''
}

async function handleCheckout(request, env, requestUrl) {
  if (request.method !== 'POST') {
    return jsonResponse({ ok: false, error: 'Method not allowed.' }, 405, request)
  }

  const apiKey = await firstSecretEnv(env, 'API_PROD_KEY', 'CREEM_API_KEY', 'CREEM_KEY')
  if (!apiKey) {
    return jsonResponse({ ok: false, error: 'Payment is not configured yet.' }, 503, request)
  }

  let body
  try {
    body = await request.json()
  } catch {
    return jsonResponse({ ok: false, error: 'Invalid JSON body.' }, 400, request)
  }

  const planId = typeof body?.planId === 'string' ? body.planId : 'pro'
  const billing = body?.billing === 'monthly' ? 'monthly' : 'annual'
  const plan = planCatalog[planId] || planCatalog.pro
  const successUrl = `${resolvePublicAppOrigin(requestUrl)}/checkout/done`

  try {
    const productId = await getOrCreateCreemProduct(env, apiKey, plan, billing, successUrl)
    const checkout = await requestCreemJson(apiKey, `${resolveCreemBase(env)}/v1/checkouts`, {
      product_id: productId,
      units: 1,
      success_url: successUrl,
      request_id: `nine_router_${Date.now()}_${Math.random().toString(16).slice(2)}`,
      metadata: {
        site: '9router.space',
        planId: plan.id,
        billing,
      },
    })
    const checkoutUrl = extractCheckoutUrl(checkout)
    if (!checkoutUrl) throw new Error('Creem did not return a checkout URL.')
    return jsonResponse({ ok: true, checkoutUrl }, 200, request)
  } catch {
    return jsonResponse({ ok: false, error: 'Secure checkout could not be created yet.' }, 502, request)
  }
}

function handleRuntime(request, requestUrl) {
  return jsonResponse(
    {
      ok: true,
      publicAppOrigin: resolvePublicAppOrigin(requestUrl),
      deployment: 'cloudflare-workers-assets',
      paymentProvider: 'creem',
      defaultPlan: 'pro',
      defaultBilling: 'annual',
      annualDiscount: '50%',
      ts: Date.now(),
    },
    200,
    request,
  )
}

async function handleAnalytics(request, env) {
  return handleAnalyticsRequest(request, env, { siteKey: '9router' })
}

function buildSitemapXml() {
  const today = new Date().toISOString().slice(0, 10)
  const urls = indexablePaths
    .map((path) => {
      const priority = path === '/' ? '1.0' : path === '/privacy' || path === '/terms' ? '0.4' : path === '/pricing' ? '0.9' : '0.78'
      const changefreq = path === '/' || path === '/pricing' ? 'weekly' : 'monthly'
      const canonicalPath = path === '/' ? '/' : `${path}/`
      return `  <url>
    <loc>${LIVE_ORIGIN}${canonicalPath}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`
}

function handleSitemap(request) {
  const headers = securityHeaders(request)
  headers.set('Content-Type', 'application/xml; charset=utf-8')
  headers.set('Cache-Control', 'public, max-age=3600')
  return new Response(buildSitemapXml(), { status: 200, headers })
}

function handleRobots(request) {
  const headers = securityHeaders(request)
  headers.set('Content-Type', 'text/plain; charset=utf-8')
  headers.set('Cache-Control', 'public, max-age=3600')
  const body = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /checkout/done
Sitemap: ${LIVE_ORIGIN}/sitemap.xml
`
  return new Response(body, { status: 200, headers })
}

function noIndexNotFoundResponse(request) {
  const headers = securityHeaders(request)
  headers.set('Content-Type', 'text/html; charset=utf-8')
  headers.set('Cache-Control', 'no-store')
  headers.set('X-Robots-Tag', 'noindex, nofollow')
  return new Response('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><title>Page not found</title></head><body><main><h1>Page not found</h1><p>This URL is not a public page for this product.</p></main></body></html>', { status: 404, headers })
}

async function fetchAsset(request, env) {
  if (env?.SITE_ASSETS?.fetch) {
    const requestUrl = new URL(request.url)
    const normalizedPath = requestUrl.pathname.replace(/\/+$/, '') || '/'

    if (!staticAssetPaths.has(normalizedPath) && !/\.[a-z0-9]+$/i.test(normalizedPath)) return noIndexNotFoundResponse(request)

    if (staticAssetPaths.has(normalizedPath)) {
      const assetUrl = new URL(request.url)
      assetUrl.pathname = normalizedPath === '/' ? '/' : `${normalizedPath}/index.html`
      const assetResponse = await env.SITE_ASSETS.fetch(new Request(assetUrl.toString(), request))
      if (assetResponse.status !== 404) return assetResponse
    }

    return env.SITE_ASSETS.fetch(request)
  }

  return new Response('Cloudflare asset binding is unavailable.', {
    status: 500,
    headers: securityHeaders(request),
  })
}

export async function handleRequest(request, env) {
  const requestUrl = new URL(request.url)
  const round18 = round18Sites.get(requestUrl.hostname)
  if (round18) {
    const proofResponse = await handleRound18Proof(request, env, round18.project)
    if (proofResponse) return proofResponse
    return round18.handler(request, round18Env(env, round18.project), requestUrl)
  }

  const round22 = round22Sites.get(requestUrl.hostname)
  if (round22) {
    const proofResponse = await handleRoundSiteProof(request, env, '_round22', round22.project)
    if (proofResponse) return proofResponse
    return round22.handler(request, roundSiteEnv(env, '_round22', round22.project), requestUrl)
  }

  if (request.method === 'OPTIONS') return handleOptions(request)
  if (requestUrl.pathname === '/api/nowpayments-checkout') {
    return handleNowPaymentsCheckout(request, env, {
      plans: planCatalog,
      defaultPlanId: 'pro',
      siteName: '9router',
      siteKey: '9router',
      annualDiscountMultiplier: typeof ANNUAL_DISCOUNT_MULTIPLIER !== 'undefined'
        ? ANNUAL_DISCOUNT_MULTIPLIER
        : (typeof annualBillingMultiplier !== 'undefined' ? annualBillingMultiplier : 0.5),
    })
  }

  if (requestUrl.pathname === '/api/runtime') return handleRuntime(request, requestUrl)
  if (requestUrl.pathname === '/api/checkout') return handleCheckout(request, env, requestUrl)
  if (requestUrl.pathname === '/api/analytics/events') return handleAnalytics(request, env)

  const redirect = maybeRedirectToHttps(requestUrl)
  if (redirect) return redirect

  if (requestUrl.pathname === '/sitemap.xml') return handleSitemap(request)
  if (requestUrl.pathname === '/robots.txt') return handleRobots(request)

  return fetchAsset(request, env)
}

export default {
  async fetch(request, env) {
    try {
      return await handleRequest(request, env)
    } catch {
      return jsonResponse({ ok: false, error: 'Internal server error.' }, 500, request)
    }
  },
}
