import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import ts from 'typescript'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const distDir = path.join(rootDir, 'dist')
const sourceIndexPath = path.join(distDir, 'index.html')
const keywordSourcePath = path.join(rootDir, 'src', 'content', 'keyword-pages.ts')
const origin = 'https://9router.space'
const siteName = '9router Space'
const defaultTitle = '9router Space | AI Router Control Plane'
const defaultDescription =
  '9router Space helps teams plan a managed 9router rollout for Codex, Cursor, Antigravity, Docker, npm installs, fallback models, and token savings.'

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

const sourceIndex = await fs.readFile(sourceIndexPath, 'utf8')
const keywordPages = await loadKeywordPages()

await writeStaticPage('/', {
  title: defaultTitle,
  description: defaultDescription,
  robots: 'index,follow',
  canonicalPath: '/',
  rootHtml: buildHomePrerender(),
  structuredData: [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: siteName,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Web',
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'USD',
        lowPrice: '14.50',
        highPrice: '124.50',
        availability: 'https://schema.org/InStock',
      },
      description: defaultDescription,
      url: `${origin}/`,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: siteName,
      url: `${origin}/`,
    },
  ],
})

for (const page of keywordPages) {
  const title = `${page.title} | ${siteName}`
  await writeStaticPage(page.path, {
    title,
    description: page.description,
    robots: 'index,follow',
    canonicalPath: page.path,
    rootHtml: buildKeywordPrerender(page),
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: title,
        description: page.description,
        url: `${origin}${page.path}`,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}/` },
          { '@type': 'ListItem', position: 2, name: page.h1, item: `${origin}${page.path}` },
        ],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: page.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
    ],
  })
}

await writeStaticPage('/pricing', {
  title: '9router Space Pricing | Pro Annual AI Router Rollout',
  description: 'Compare 9router Space Starter, Pro, and Operations plans. Pro annual is selected by default and annual billing is 50% cheaper.',
  robots: 'index,follow',
  canonicalPath: '/pricing',
  rootHtml: buildPricingPrerender(),
  structuredData: [
    {
      '@context': 'https://schema.org',
      '@type': 'OfferCatalog',
      name: '9router Space pricing',
      url: `${origin}/pricing`,
    },
  ],
})

await writeStaticPage('/privacy', {
  title: `Privacy | ${siteName}`,
  description: 'How 9router Space handles analytics, checkout metadata, and managed-site interactions.',
  robots: 'index,follow',
  canonicalPath: '/privacy',
  rootHtml: buildLegalPrerender('Privacy Policy', 'This policy covers analytics, checkout, and user interactions on the 9router Space site.', [
    {
      heading: 'What we collect',
      paragraphs: [
        '9router Space collects only information reasonably needed to operate the website, process checkout, prevent abuse, measure performance, and respond to support.',
        'The public planner does not require provider API keys, OAuth tokens, private repositories, credentials, secrets, files, source code, or production data.',
      ],
    },
    {
      heading: 'Providers and contact',
      paragraphs: [
        'Cloudflare supports hosting and security infrastructure. Creem supports hosted checkout and payment processing.',
        'Privacy and support requests should be sent to support@aigeamy.com.',
      ],
    },
    {
      heading: 'Security, retention, and deletion',
      paragraphs: [
        'No internet service can be guaranteed perfectly secure. Users should not submit credentials, secrets, regulated data, or highly sensitive information through the public planner.',
        'Information is retained only as long as reasonably needed for support, security, accounting, fraud prevention, dispute handling, and legal compliance.',
      ],
    },
    {
      heading: 'Your choices and rights',
      paragraphs: [
        'Depending on your location, you may have rights to request access, correction, deletion, portability, restriction, or objection regarding personal information we control.',
        'California and other privacy laws may provide additional rights when their thresholds and conditions apply.',
      ],
    },
    {
      heading: 'Children, changes, and contact',
      paragraphs: [
        '9router Space is intended for business and developer audiences and is not directed to children under 13.',
        'Questions about privacy, support, or data handling should be sent to support@aigeamy.com.',
      ],
    },
  ]),
  structuredData: [],
})

await writeStaticPage('/terms', {
  title: `Terms | ${siteName}`,
  description: 'Terms for using the 9router Space managed site, hosted payment flow, and related support services.',
  robots: 'index,follow',
  canonicalPath: '/terms',
  rootHtml: buildLegalPrerender('Terms of Service', 'These terms describe the limits and responsibilities of the 9router Space site.', [
    {
      heading: 'Acceptance and review required',
      paragraphs: [
        '9router Space is provided for supervised 9router adoption and AI routing workflows. AI-assisted output, route recommendations, and setup notes may be incomplete, inaccurate, insecure, unavailable, unsuitable, or wrong.',
        'Users are responsible for reviewing, testing, validating, and approving output, provider routes, deployments, and costs before relying on them.',
      ],
    },
    {
      heading: 'Payments and third-party services',
      paragraphs: [
        'Payments are processed by Creem in a hosted popup window. Successful checkouts return the user to the homepage.',
        'Cloudflare, Creem, GitHub, npm, Docker, model providers, infrastructure providers, and other third-party services may be involved in hosting, checkout, integrations, or workflows.',
      ],
    },
    {
      heading: 'No warranties',
      paragraphs: [
        '9router Space is provided as is and as available. To the maximum extent permitted by law, all express, implied, statutory, and other warranties are disclaimed.',
        'We do not warrant uninterrupted service, error-free operation, complete security, accuracy of AI output, provider availability, token savings, revenue results, rankings, conversion results, or business outcomes.',
      ],
    },
    {
      heading: 'Limitation of liability',
      paragraphs: [
        'To the maximum extent permitted by law, 9router Space and its operators, affiliates, suppliers, and service providers will not be liable for indirect, incidental, special, consequential, exemplary, punitive, or lost-profit damages.',
        'To the maximum extent permitted by law, total liability for any claim is limited to the greater of 100 USD or the amount paid for 9router Space in the three months before the event giving rise to the claim.',
      ],
    },
    {
      heading: 'Disputes',
      paragraphs: [
        'Before filing a claim, you agree to email support@aigeamy.com and give us 30 days to try to resolve the dispute informally.',
        'To the maximum extent permitted by law, disputes must be handled individually rather than as class, collective, consolidated, private attorney general, or representative actions.',
        'Support requests and dispute notices should be sent to support@aigeamy.com.',
      ],
    },
  ]),
  structuredData: [],
})

await writeStaticPage('/checkout/done', {
  title: `Checkout | ${siteName}`,
  description: 'Completing your 9router Space checkout.',
  robots: 'noindex,nofollow',
  canonicalPath: '/checkout/done',
  rootHtml: buildLegalPrerender('Finishing checkout...', 'You will return to the 9router Space homepage when the hosted payment session closes.'),
  structuredData: [],
})

await fs.writeFile(path.join(distDir, 'sitemap.xml'), buildSitemapXml())
await fs.writeFile(path.join(distDir, 'robots.txt'), buildRobotsTxt())

async function loadKeywordPages() {
  const source = await fs.readFile(keywordSourcePath, 'utf8')
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
      verbatimModuleSyntax: false,
    },
  })
  const moduleUrl = `data:text/javascript;base64,${Buffer.from(transpiled.outputText).toString('base64')}`
  const mod = await import(moduleUrl)
  return mod.keywordPages
}

async function writeStaticPage(routePath, page) {
  const html = renderHtml(page)

  if (routePath === '/') {
    await fs.writeFile(sourceIndexPath, html)
    return
  }

  const outputDir = path.join(distDir, routePath.replace(/^\/+/, ''))
  await fs.mkdir(outputDir, { recursive: true })
  await fs.writeFile(path.join(outputDir, 'index.html'), html)
}

function renderHtml({ title, description, robots, canonicalPath, rootHtml, structuredData }) {
  const canonicalUrl = `${origin}${canonicalPath === '/' ? '/' : canonicalPath}`
  let html = sourceIndex
  html = html.replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(title)}</title>`)
  html = upsertMeta(html, 'name', 'description', description)
  html = upsertMeta(html, 'name', 'robots', robots)
  html = upsertMeta(html, 'property', 'og:title', title)
  html = upsertMeta(html, 'property', 'og:description', description)
  html = upsertMeta(html, 'property', 'og:url', canonicalUrl)
  html = upsertMeta(html, 'name', 'twitter:title', title)
  html = upsertMeta(html, 'name', 'twitter:description', description)
  html = upsertCanonical(html, canonicalUrl)
  html = html.replace('<div id="root"></div>', `<div id="root">${rootHtml}</div>`)

  const graph =
    structuredData.length > 1
      ? { '@context': 'https://schema.org', '@graph': structuredData.map(stripContext) }
      : structuredData[0]

  if (graph) {
    html = html.replace(
      '</head>',
      `    <script type="application/ld+json" id="nine-router-prerender-schema">${JSON.stringify(graph)}</script>\n  </head>`,
    )
  }

  return html
}

function upsertMeta(html, attrName, attrValue, content) {
  const pattern = new RegExp(`<meta(?=[^>]*\\s${attrName}="${escapeRegExp(attrValue)}")[^>]*>`, 's')
  const replacement = `<meta ${attrName}="${escapeAttr(attrValue)}" content="${escapeAttr(content)}" />`
  if (pattern.test(html)) return html.replace(pattern, replacement)
  return html.replace('</head>', `    ${replacement}\n  </head>`)
}

function upsertCanonical(html, href) {
  const replacement = `<link rel="canonical" href="${escapeAttr(href)}" />`
  const pattern = /<link(?=[^>]*\srel="canonical")[^>]*>/s
  if (pattern.test(html)) return html.replace(pattern, replacement)
  return html.replace('</head>', `    ${replacement}\n  </head>`)
}

function stripContext(item) {
  const { '@context': _context, ...rest } = item
  return rest
}

function buildHomePrerender() {
  return `
    <main class="nr-main">
      <section class="nr-hero" id="planner">
        <div>
          <p class="nr-eyebrow">9router managed rollout</p>
          <h1>Run 9router as the control plane for every AI coding tool.</h1>
          <p class="nr-lede">Plan route fallback, token policy, Docker persistence, and Pro annual checkout without losing the product page.</p>
          <p><a class="nr-btn nr-btn-primary" href="/pricing">Choose Pro annual</a></p>
        </div>
      </section>
    </main>
    <footer class="nr-footer">
      <div class="nr-footer-inner">
        <span>9router Space</span>
        <a href="/privacy">Privacy</a>
        <a href="/terms">Terms</a>
        <a href="mailto:support@aigeamy.com">support@aigeamy.com</a>
      </div>
    </footer>`
}

function buildPricingPrerender() {
  return `
    <main class="nr-main">
      <section class="nr-pricing-page-hero">
        <p class="nr-eyebrow">Pricing</p>
        <h1>9router Space pricing starts with Pro selected and annual billing already on.</h1>
        <p class="nr-lede">Pro annual is the default path and annual billing is 50% cheaper than the monthly run-rate.</p>
      </section>
    </main>`
}

function buildKeywordPrerender(page) {
  const sections = page.sections
    .map(
      (section) => `
        <section>
          <h2>${escapeHtml(section.heading)}</h2>
          ${section.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('\n')}
          ${section.bullets?.length ? `<ul>${section.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join('')}</ul>` : ''}
        </section>`,
    )
    .join('\n')
  const faqs = page.faqs
    .map((faq) => `<article><h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p></article>`)
    .join('\n')

  return `
    <main class="nr-main">
      <article class="nr-article">
        <a href="/">9router Space</a>
        <p class="nr-eyebrow">${escapeHtml(page.eyebrow)}</p>
        <h1>${escapeHtml(page.h1)}</h1>
        <p class="nr-lede">${escapeHtml(page.lede)}</p>
        <p>${escapeHtml(page.intent)}</p>
        ${sections}
        <section>
          <h2>Common questions</h2>
          ${faqs}
        </section>
        <p><a class="nr-btn nr-btn-primary" href="/pricing">${escapeHtml(page.ctaLabel)}</a></p>
      </article>
    </main>`
}

function buildLegalPrerender(title, description, sections = []) {
  const sectionHtml = sections
    .map(
      (section) => `
        <section>
          <h2>${escapeHtml(section.heading)}</h2>
          ${section.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('\n')}
        </section>`,
    )
    .join('\n')

  return `
    <main class="nr-main">
      <article class="nr-article">
        <a href="/">9router Space</a>
        <h1>${escapeHtml(title)}</h1>
        <p class="nr-lede">${escapeHtml(description)}</p>
        ${sectionHtml}
      </article>
    </main>`
}

function buildSitemapXml() {
  const today = new Date().toISOString().slice(0, 10)
  const urls = indexablePaths
    .map((routePath) => {
      const priority = routePath === '/' ? '1.0' : routePath === '/privacy' || routePath === '/terms' ? '0.4' : routePath === '/pricing' ? '0.9' : '0.78'
      const changefreq = routePath === '/' || routePath === '/pricing' ? 'weekly' : 'monthly'
      return `  <url>
    <loc>${origin}${routePath === '/' ? '/' : routePath}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
}

function buildRobotsTxt() {
  return `User-agent: *
Allow: /
Disallow: /api/
Disallow: /checkout/done
Sitemap: ${origin}/sitemap.xml
`
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, '&#96;')
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
