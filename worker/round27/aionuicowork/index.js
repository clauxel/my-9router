function securityHeaders() {
  return new Headers({
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  })
}

function siteKey(hostname) {
  return String(hostname || 'managed-site')
    .replace(/^www\./, '')
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase() || 'managed-site'
}

function titleFromHost(hostname) {
  return siteKey(hostname)
    .split('-')
    .filter(Boolean)
    .map((part) => part.slice(0, 1).toUpperCase() + part.slice(1))
    .join(' ')
}

function jsonResponse(payload, request, status = 200) {
  const headers = securityHeaders(request)
  headers.set('Content-Type', 'application/json; charset=utf-8')
  return new Response(JSON.stringify(payload), { status, headers })
}

export async function handleRequest(request) {
  const requestUrl = new URL(request.url)
  const origin = `https://${requestUrl.hostname.replace(/^www\./, '')}`
  const key = siteKey(requestUrl.hostname)
  const name = titleFromHost(requestUrl.hostname)

  if (request.method === 'OPTIONS' && requestUrl.pathname.startsWith('/api/')) {
    return new Response(null, { status: 204, headers: securityHeaders(request) })
  }

  if (requestUrl.pathname === '/api/runtime') {
    return jsonResponse({
      ok: true,
      publicAppOrigin: origin,
      deployment: 'cloudflare-workers-assets',
      paymentProvider: 'polar',
      paymentConfigured: true,
      defaultPlan: 'pro',
      defaultBilling: 'annual',
      annualDiscount: '50%',
      siteKey: key,
      ts: Date.now(),
    }, request)
  }

  if (requestUrl.pathname === '/api/checkout' || requestUrl.pathname === '/api/polar-checkout') {
    if (request.method !== 'POST') return jsonResponse({ ok: false, message: 'Method not allowed.' }, request, 405)
    return jsonResponse({
      ok: true,
      paymentProvider: 'polar',
      provider: 'polar',
      checkoutUrl: 'https://buy.polar.sh/polar_cl_v0pIgEl6B8RotVGu1kG9QXClW2sPOqdlxe2VV4WXhhI',
      planId: 'pro:annual',
      billing: 'annual',
      siteKey: key,
    }, request)
  }

  if (requestUrl.pathname === '/robots.txt') {
    return new Response(`User-agent: *
Allow: /
Disallow: /api/
Sitemap: ${origin}/sitemap.xml
`, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
    })
  }

  if (requestUrl.pathname === '/sitemap.xml') {
    return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${origin}/</loc></url><url><loc>${origin}/pricing/</loc></url></urlset>`, {
      headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
    })
  }

  const title = `${name} | Polar checkout ready` 
  const body = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><meta name="description" content="${name} is being served by a Polar-ready managed checkout route."><link rel="canonical" href="${origin}/"><style>body{margin:0;font-family:Inter,Arial,sans-serif;background:#f7f9fc;color:#172033;line-height:1.55}.wrap{width:min(960px,calc(100% - 32px));margin:0 auto;padding:56px 0}.panel{background:#fff;border:1px solid #d8e0eb;border-radius:8px;padding:28px}h1{font-size:44px;line-height:1.05;margin:0 0 14px}p{color:#526173}.actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:18px}.button{display:inline-flex;align-items:center;justify-content:center;min-height:42px;padding:0 14px;border-radius:8px;border:1px solid #245bdb;background:#245bdb;color:#fff;text-decoration:none;font-weight:800}.button.secondary{background:#fff;color:#172033;border-color:#d8e0eb}</style></head><body><main class="wrap"><section class="panel"><p>Managed checkout route</p><h1>${name}</h1><p>This site is on the managed migration route with Polar checkout metadata and runtime status enabled.</p><div class="actions"><a class="button" href="/pricing/">View pricing</a><a class="button secondary" href="mailto:support@aigeamy.com">Contact support</a></div></section></main></body></html>`
  return new Response(body, { headers: securityHeaders(request) })
}
