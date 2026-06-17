const LIVE_ORIGIN = 'https://9router.space'
const LIVE_HOST = '9router.space'
const ALT_HOSTS = new Set(['www.9router.space'])
const ANNUAL_DISCOUNT_MULTIPLIER = 0.5

const creemProductCache = new Map()

const planCatalog = {
  starter: {
    id: 'starter',
    name: 'Starter',
    monthlyAmountCents: 900,
    annualDiscountMultiplier: 1,
    currency: 'USD',
    summary: 'one-operator 9router setup',
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    monthlyAmountCents: 2900,
    annualDiscountMultiplier: 0.5,
    currency: 'USD',
    summary: 'default managed 9router team rollout',
  },
  ops: {
    id: 'ops',
    name: 'Enterprise',
    monthlyAmountCents: 5900,
    annualDiscountMultiplier: 1,
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

const staticAssetPaths = new Set([...indexablePaths, '/resources'])
const staticAssetFiles = new Set(['/favicon.svg', '/9router-dashboard.png', '/llms.txt'])
const staticAssetPrefixes = ['/assets/']

function securityHeaders(request) {
  const headers = new Headers({
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  })

  const origin = request?.headers?.get?.('Origin')
  if (origin) {
    try {
      const url = new URL(origin)
      if (url.hostname === LIVE_HOST || ALT_HOSTS.has(url.hostname) || url.hostname.endsWith('.workers.dev') || url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
        headers.set('Access-Control-Allow-Origin', origin)
        headers.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
        headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        headers.set('Vary', 'Origin')
      }
    } catch {
      // Ignore malformed origins.
    }
  }

  return headers
}

function jsonResponse(payload, status = 200, request = null) {
  const headers = securityHeaders(request)
  headers.set('Content-Type', 'application/json; charset=utf-8')
  headers.set('Cache-Control', 'no-store')
  return new Response(JSON.stringify(payload), { status, headers })
}

function textResponse(body, request, contentType = 'text/plain; charset=utf-8') {
  const headers = securityHeaders(request)
  headers.set('Content-Type', contentType)
  headers.set('Cache-Control', 'public, max-age=3600')
  return new Response(body, { status: 200, headers })
}

function resolvePublicAppOrigin(requestUrl) {
  if (requestUrl.hostname === LIVE_HOST || ALT_HOSTS.has(requestUrl.hostname)) return LIVE_ORIGIN
  if (requestUrl.hostname.endsWith('.workers.dev')) return requestUrl.origin
  return requestUrl.origin
}

function maybeRedirectToHttps(requestUrl) {
  if (requestUrl.hostname === LIVE_HOST && requestUrl.protocol === 'https:') return null
  if (!ALT_HOSTS.has(requestUrl.hostname) && requestUrl.hostname !== LIVE_HOST) return null
  const redirectUrl = new URL(requestUrl)
  redirectUrl.protocol = 'https:'
  redirectUrl.hostname = LIVE_HOST
  return Response.redirect(redirectUrl.toString(), 301)
}

async function firstSecretEnv(env, ...keys) {
  for (const key of keys) {
    const value = env?.[key]
    if (typeof value === 'string' && value.trim()) return value.trim()
    if (value && typeof value.get === 'function') {
      const resolved = await value.get()
      if (typeof resolved === 'string' && resolved.trim()) return resolved.trim()
    }
  }
  return ''
}

function resolveCreemBase(env) {
  const raw = String(env?.CREEM_API_BASE ?? '').trim()
  return raw ? raw.replace(/\/+$/, '') : 'https://api.creem.io'
}

function normalizeEnvKey(value) {
  return String(value)
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

function resolveConfiguredProductId(env, planId, billing) {
  const cycle = billing === 'monthly' ? 'MONTHLY' : 'YEARLY'
  const tier = planId === 'ops' ? 'OPS' : planId === 'starter' ? 'STARTER' : 'PRO'
  const alternateTier = planId === 'ops' ? 'ENTERPRISE' : tier
  const normalizedSelection = normalizeEnvKey(`${planId}_${billing}`)
  const alternateSelection = planId === 'ops' ? normalizeEnvKey(`enterprise_${billing}`) : normalizedSelection
  const keys = [
    `CREEM_PRODUCT_${alternateTier}_${cycle}`,
    `CREEM_PRODUCT_${tier}_${cycle}`,
    `CREEM_PRODUCT_ID_9ROUTER_${alternateSelection}`,
    `CREEM_PRODUCT_ID_9ROUTER_${normalizedSelection}`,
    `CREEM_PRODUCT_ID_${alternateSelection}`,
    `CREEM_PRODUCT_ID_${normalizedSelection}`,
    `CREEM_PRODUCT_ID_${alternateTier}`,
    `CREEM_PRODUCT_ID_${tier}`,
    'CREEM_PRODUCT_ID',
  ]

  for (const key of keys) {
    const value = env?.[key]
    if (typeof value === 'string' && value.trim()) return value.trim()
  }
  return ''
}

function formatMoney(amountCents, currency) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: amountCents % 100 === 0 ? 0 : 2,
  }).format(amountCents / 100)
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

  const annualMultiplier = Number(plan.annualDiscountMultiplier ?? ANNUAL_DISCOUNT_MULTIPLIER)
  const safeAnnualMultiplier = Number.isFinite(annualMultiplier) && annualMultiplier > 0 ? annualMultiplier : 1
  const monthlyAmountCents =
    billing === 'annual' ? Math.round(plan.monthlyAmountCents * safeAnnualMultiplier) : plan.monthlyAmountCents
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
    return jsonResponse({ ok: false, error: 'Creem is not configured on this deployment.' }, 503, request)
  }

  let body
  try {
    body = await request.json()
  } catch {
    return jsonResponse({ ok: false, error: 'Invalid JSON body.' }, 400, request)
  }

  const rawPlanId = typeof body?.planId === 'string' ? body.planId : typeof body?.plan === 'string' ? body.plan : 'pro'
  const planId = rawPlanId === 'enterprise' ? 'ops' : rawPlanId
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
        site: requestUrl.hostname,
        planId: plan.id,
        billing,
      },
    })
    const checkoutUrl = extractCheckoutUrl(checkout)
    if (!checkoutUrl) throw new Error('Creem did not return a checkout URL.')
    return jsonResponse({ ok: true, checkoutUrl, paymentProvider: 'creem' }, 200, request)
  } catch (error) {
    return jsonResponse(
      { ok: false, error: error instanceof Error ? error.message : 'Checkout could not be started.' },
      502,
      request,
    )
  }
}

async function handleNowPaymentsCheckout(request) {
  if (request.method !== 'POST') {
    return jsonResponse({ ok: false, error: 'Method not allowed.' }, 405, request)
  }
  return jsonResponse({ ok: false, error: 'USDC wallet checkout is not configured on this dedicated deployment.' }, 503, request)
}

function handleRuntime(request, env, requestUrl) {
  return jsonResponse(
    {
      ok: true,
      publicAppOrigin: resolvePublicAppOrigin(requestUrl),
      deployment: 'cloudflare-workers-assets-dedicated',
      paymentProvider: 'creem',
      creemConfigured: Boolean(env?.API_PROD_KEY || env?.CREEM_API_KEY || env?.CREEM_KEY),
      defaultPlan: 'pro',
      defaultBilling: 'annual',
      annualDiscount: '50%',
      ts: Date.now(),
    },
    200,
    request,
  )
}

function handleRobots(request) {
  const body = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /checkout/
Disallow: /checkout/done
Sitemap: ${LIVE_ORIGIN}/sitemap.xml
`
  return textResponse(body, request)
}

function sameOriginUrl(requestUrl, pathname) {
  const origin = resolvePublicAppOrigin(requestUrl)
  return new URL(pathname, origin)
}

function redirectResponse(url, request, status = 303) {
  const headers = securityHeaders(request)
  headers.set('Location', url.toString())
  headers.set('Cache-Control', 'no-store')
  return new Response(null, { status, headers })
}

function handleCheckoutRoute(request, requestUrl) {
  const path = requestUrl.pathname.replace(/\/+$/, '') || '/'
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return jsonResponse({ ok: false, error: 'Method not allowed.' }, 405, request)
  }

  if (path === '/checkout/done') {
    const successUrl = sameOriginUrl(requestUrl, '/')
    successUrl.searchParams.set('payment', 'success')
    return redirectResponse(successUrl, request)
  }

  const pricingUrl = sameOriginUrl(requestUrl, '/pricing/')
  for (const key of ['plan', 'planId', 'billing']) {
    const value = requestUrl.searchParams.get(key)
    if (value) pricingUrl.searchParams.set(key === 'planId' ? 'plan' : key, value)
  }
  pricingUrl.hash = 'pricing'
  return redirectResponse(pricingUrl, request)
}

function handleSitemap(request) {
  const urls = indexablePaths
    .map((path) => {
      const canonicalPath = path === '/' ? '/' : `${path.replace(/\/+$/, '')}/`
      const priority = path === '/' ? '1.0' : path === '/pricing' ? '0.9' : '0.75'
      return `  <url><loc>${LIVE_ORIGIN}${canonicalPath === '/' ? '' : canonicalPath}</loc><lastmod>2026-06-17</lastmod><changefreq>weekly</changefreq><priority>${priority}</priority></url>`
    })
    .join('\n')
  return textResponse(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`,
    request,
    'application/xml; charset=utf-8',
  )
}

function noIndexNotFoundResponse(request) {
  const headers = securityHeaders(request)
  headers.set('Content-Type', 'text/html; charset=utf-8')
  headers.set('Cache-Control', 'no-store')
  headers.set('X-Robots-Tag', 'noindex, nofollow')
  const body = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><title>Page not found</title></head><body><main><h1>Page not found</h1><p>This URL is not a public page for 9router Space.</p></main></body></html>'
  return new Response(body, { status: 404, headers })
}

function withSecurityHeaders(response, request) {
  const headers = new Headers(response.headers)
  for (const [key, value] of securityHeaders(request)) headers.set(key, value)
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

async function fetchAsset(request, env) {
  if (!env?.SITE_ASSETS?.fetch) {
    return new Response('Static assets are not bound for this deployment.', {
      status: 503,
      headers: securityHeaders(request),
    })
  }

  const requestUrl = new URL(request.url)
  const normalizedPath = requestUrl.pathname.replace(/\/+$/, '') || '/'
  const isAllowedAssetFile = staticAssetFiles.has(normalizedPath)
  const isAllowedAssetPrefix = staticAssetPrefixes.some((prefix) => requestUrl.pathname.startsWith(prefix))

  if (!staticAssetPaths.has(normalizedPath) && !isAllowedAssetFile && !isAllowedAssetPrefix) {
    return noIndexNotFoundResponse(request)
  }

  const assetResponse = await env.SITE_ASSETS.fetch(request)
  if (assetResponse.status === 404 && !isAllowedAssetFile && !isAllowedAssetPrefix) {
    return noIndexNotFoundResponse(request)
  }

  return withSecurityHeaders(assetResponse, request)
}

async function handleRequest(request, env) {
  const requestUrl = new URL(request.url)
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: securityHeaders(request) })
  if (requestUrl.pathname === '/api/runtime') return handleRuntime(request, env, requestUrl)
  if (requestUrl.pathname === '/api/checkout') return handleCheckout(request, env, requestUrl)
  if (requestUrl.pathname === '/api/nowpayments-checkout') return handleNowPaymentsCheckout(request)
  if (requestUrl.pathname === '/api/analytics/events') return jsonResponse({ ok: true }, 202, request)

  const redirect = maybeRedirectToHttps(requestUrl)
  if (redirect) return redirect

  const normalizedPath = requestUrl.pathname.replace(/\/+$/, '') || '/'
  if (normalizedPath === '/checkout' || normalizedPath === '/checkout/done') {
    return handleCheckoutRoute(request, requestUrl)
  }

  if (requestUrl.pathname === '/robots.txt') return handleRobots(request)
  if (requestUrl.pathname === '/sitemap.xml') return handleSitemap(request)
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
