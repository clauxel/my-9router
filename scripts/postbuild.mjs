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
const defaultTitle = '9router Space - AI Router Control Plane for Codex, Cursor, and Models'
const defaultDescription =
  'Plan a managed 9router rollout for Codex, Cursor, Antigravity, Docker, npm installs, fallback models, token savings, and AI routing operations.'

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
        lowPrice: '9',
        highPrice: '59',
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
        url: buildCanonicalUrl(page.path),
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}/` },
          { '@type': 'ListItem', position: 2, name: page.h1, item: buildCanonicalUrl(page.path) },
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
  description: 'Compare 9router Space Starter, Pro, and Enterprise plans. Pro annual is selected by default with a 50% yearly discount and no automatic renewal.',
  robots: 'index,follow',
  canonicalPath: '/pricing',
  rootHtml: buildPricingPrerender(),
  structuredData: [
    {
      '@context': 'https://schema.org',
      '@type': 'OfferCatalog',
      name: '9router Space pricing',
      url: buildCanonicalUrl('/pricing'),
    },
  ],
})

await writeStaticPage('/checkout', {
  title: '9router Space Checkout | Pro Annual',
  description: 'Start the 9router Space Pro annual checkout from a crawlable checkout landing page.',
  robots: 'index,follow',
  canonicalPath: '/checkout',
  rootHtml: buildCheckoutPrerender(),
  structuredData: [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: '9router Space checkout',
      description: 'Start the 9router Space Pro annual checkout.',
      url: buildCanonicalUrl('/checkout'),
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
await syncRoundSites()

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
  const canonicalUrl = buildCanonicalUrl(canonicalPath)
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
  html = html.replace(
    /<div id="root">[\s\S]*?<\/div>\s*(?=<script|<\/body>)/,
    `<div id="root">${rootHtml}</div>\n    `,
  )

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
          <p class="nr-lede">Plan route fallback, token policy, Docker persistence, and Pro annual checkout for Codex, Cursor, Antigravity, npm, and Docker teams without losing the product page.</p>
          <p>
            <a class="nr-btn nr-btn-primary" href="/pricing/">Choose Pro annual</a>
            <a class="nr-btn nr-btn-secondary" href="/9router-codex/">Plan Codex routing</a>
          </p>
        </div>
      </section>
      <section class="nr-section" aria-labelledby="home-problem">
        <p class="nr-eyebrow">Problem</p>
        <h2 id="home-problem">AI coding teams need one routing policy instead of tool-by-tool guesswork.</h2>
        <p>9router Space is for teams that run multiple AI coding tools and need a single operational plan for model choice, provider fallback, token limits, Docker persistence, and usage review. It keeps Codex, Cursor, Antigravity, local npm installs, and hosted endpoints on the same rollout map.</p>
      </section>
      <section class="nr-section" aria-labelledby="home-solution">
        <p class="nr-eyebrow">Solution</p>
        <h2 id="home-solution">Use 9router as a managed AI router control plane.</h2>
        <p>The service turns routing decisions into a documented workspace: primary models, fallback models, budget controls, CLI setup, Docker deployment notes, and checkout-ready implementation support. Operators can start with <a href="/9router-install/">installation planning</a>, compare <a href="/9router-npm/">npm setup</a> with <a href="/9router-docker/">Docker setup</a>, then move to a paid plan from <a href="/pricing/">9router Space pricing</a>.</p>
      </section>
      <section class="nr-section" aria-labelledby="home-evidence">
        <p class="nr-eyebrow">Evidence</p>
        <h2 id="home-evidence">The public site exposes crawlable pages for every key route.</h2>
        <p>Search engines and answer engines can reach dedicated pages for <a href="/9router-codex/">Codex routing</a>, <a href="/9router-cursor/">Cursor routing</a>, <a href="/9router-antigravity/">Antigravity routing</a>, <a href="/9router-ai/">AI router operations</a>, <a href="/9router-github/">GitHub workflow context</a>, pricing, legal pages, <a href="/sitemap.xml">sitemap.xml</a>, and <a href="/llms.txt">llms.txt</a>.</p>
      </section>
      <section class="nr-section" aria-labelledby="home-plans">
        <p class="nr-eyebrow">Plans</p>
        <h2 id="home-plans">Start with Pro annual when the team is already using AI coding tools.</h2>
        <ul>
          <li><strong>Starter annual</strong> covers one operator validating a 9router workflow.</li>
          <li><strong>Pro annual</strong> is the default for Codex, Cursor, Antigravity, fallback policies, and team usage review.</li>
          <li><strong>Enterprise</strong> adds secured endpoint planning, provider governance, and heavier rollout support.</li>
        </ul>
        <p><a class="nr-btn nr-btn-primary" href="/pricing/">Compare pricing and checkout</a></p>
      </section>
      <section class="nr-section" aria-labelledby="home-faq">
        <p class="nr-eyebrow">FAQ</p>
        <h2 id="home-faq">Common 9router Space questions</h2>
        <article>
          <h3>What does 9router Space do?</h3>
          <p>9router Space plans and manages an AI routing rollout across coding tools, model providers, fallback rules, token policy, Docker persistence, and operational reporting.</p>
        </article>
        <article>
          <h3>Who is it for?</h3>
          <p>It is for developers, small teams, and operations owners who already use AI coding assistants and need a repeatable control plane instead of one-off local configuration.</p>
        </article>
        <article>
          <h3>Which setup paths are documented?</h3>
          <p>The public pages cover npm installs, Docker deployment, Codex, Cursor, Antigravity, GitHub workflow context, and broader AI router planning.</p>
        </article>
      </section>
    </main>
    <footer class="nr-footer">
      <div class="nr-footer-inner">
        <span>9router Space</span>
        <a href="/pricing/">Pricing</a>
        <a href="/9router-install/">Install</a>
        <a href="/9router-docker/">Docker</a>
        <a href="/9router-npm/">npm</a>
        <a href="/9router-ai/">AI router</a>
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
        <h1>9router Space pricing follows the Starter, Pro, and Enterprise path.</h1>
        <p class="nr-lede">Starter is $9 per month. Pro annual is $14.50 per month for one year. Enterprise is $59 per month. No checkout renews automatically.</p>
        <div class="nr-pricing-grid" aria-label="9router Space pricing plans">
          <article>
            <h2>Starter</h2>
            <p><strong>$9 / month</strong></p>
            <p>One route plan, npm or local install review, a basic provider stack, and email support.</p>
            <p><a class="nr-btn nr-btn-secondary" href="/api/checkout?plan=starter&billing=monthly">Continue with Starter</a></p>
          </article>
          <article>
            <h2>Pro annual</h2>
            <p><strong>$14.50 / month</strong></p>
            <p>$174 due today for one year. Includes Docker review, fallback policy, provider controls, and priority onboarding.</p>
            <p><a class="nr-btn nr-btn-primary" href="/api/checkout?plan=pro&billing=annual">Continue with Pro</a></p>
          </article>
          <article>
            <h2>Enterprise</h2>
            <p><strong>$59 / month</strong></p>
            <p>Secured endpoint planning, provider governance, custom deployment review, SLA support, and dedicated rollout help.</p>
            <p><a class="nr-btn nr-btn-secondary" href="/api/checkout?plan=ops&billing=monthly">Continue with Enterprise</a></p>
          </article>
        </div>
      </section>
    </main>`
}

function buildCheckoutPrerender() {
  return `
    <main class="nr-main">
      <section class="nr-pricing-page-hero">
        <p class="nr-eyebrow">Checkout</p>
        <h1>Start with 9router Space Pro annual.</h1>
        <p class="nr-lede">Use the managed checkout path for a crawlable fallback, then complete payment from the hosted pricing flow.</p>
        <p><a class="nr-btn nr-btn-primary" href="/pricing">Continue to pricing and checkout</a></p>
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
    <loc>${buildCanonicalUrl(routePath)}</loc>
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

function buildCanonicalUrl(routePath) {
  return `${origin}${routePath === '/' ? '/' : `${routePath}/`}`
}

async function syncRoundSites() {
  const workspaceRoot = path.resolve(rootDir, '..')
  const round18Projects = [
    'agentichtmlexportqa',
    'agentskillupdategate',
    'aistudioworkspaceapproval',
    'antigravityextensiongate',
    'geminisparktaskboard',
    'opendesignguard',
    'semblecodesearchgate',
    'speckitacceptance',
    'veocreditwaste',
    'webmcpactionreceipt',
  ]

  for (const project of round18Projects) {
    await copyPublicSite(project, path.join(distDir, '_round18', project))
  }

  const round22StaticProjects = [
    { project: 'codegraphcontext', sourceDir: path.join(workspaceRoot, 'codegraphcontext') },
    { project: 'openlitops', sourceDir: path.join(workspaceRoot, 'openlitops') },
    { project: 'bifrostgateway', sourceDir: path.join(workspaceRoot, 'bifrostgateway') },
    { project: 'fastmcpruntime', sourceDir: path.join(workspaceRoot, 'fastmcpruntime') },
    { project: 'agentmemorymcp', sourceDir: path.join(workspaceRoot, 'agentmemorymcp') },
    { project: 'cozeloopops', sourceDir: path.join(workspaceRoot, 'cozeloopops') },
    { project: 'pydanticcontract', sourceDir: path.join(workspaceRoot, 'pydanticcontract') },
    { project: 'clianythingharness', sourceDir: path.join(workspaceRoot, 'clianythingharness') },
    { project: 'hermesagentrun', sourceDir: path.join(workspaceRoot, 'hermesagentrun') },
    { project: 'mastraworkflow', sourceDir: path.join(workspaceRoot, 'mastraworkflow') },
    { project: 'vibecoding', sourceDir: path.join(rootDir, 'worker', 'round22', 'vibecoding') },
  ]

  for (const entry of round22StaticProjects) {
    await copyPublicSiteFrom(entry.sourceDir, path.join(distDir, '_round22', entry.project))
  }

  const round23StaticProjects = [
    'agentscangate',
    'webclawextract',
    'bbbrowserstate',
    'sbproxytraffic',
    'mcpcsessionrelay',
    'taskorchestratorgate',
    'kreuzbergextract',
    'novamirawpops',
    'arkonknowledge',
    'nextcloudteammcp',
    'protocolanalyzerai',
    'aidevkitworkflow',
    'solaceagentmesh',
    'inkeepagents',
    'headroomcompress',
  ]

  for (const project of round23StaticProjects) {
    await copyPublicSiteFrom(path.join(workspaceRoot, project), path.join(distDir, '_round23', project))
  }

  const round25StaticProjects = [
    'rtkcontext',
    'byterovermemory',
    'chromedevtoolsmcp',
    'agentmailrooms',
    'axonhubgateway',
    'jcodeharness',
    'bumblebeereceipt',
    'playwritermcp',
    'coralquery',
    'nexentagent',
    'gomodelgateway',
    'futureagievals',
    'evalscopebench',
    'autobrowserapproval',
    'mcpgatewaydesk',
  ]

  for (const project of round25StaticProjects) {
    await copyPublicSiteFrom(path.join(workspaceRoot, project), path.join(distDir, '_round25', project))
  }

  const round26StaticProjects = [
    'context7docs',
    'nangointegrationops',
    'activepiecesworkflow',
    'skybridgepackager',
    'paperclipcompany',
    'dograhvoice',
    'twentyrevenue',
    'dyadteambuilder',
    'hyperframesrender',
    'agenticinboxdesk',
    'zerolangcompiler',
    'voltagentconsole',
    'pptmasterdeck',
    'coolifylaunch',
    'holaosworkstream',
    'shipswiftcomponents',
    'intentkitcluster',
  ]

  for (const project of round26StaticProjects) {
    await copyPublicSiteFrom(path.join(workspaceRoot, project), path.join(distDir, '_round26', project))
  }

  await copyPublicSiteFrom(path.join(workspaceRoot, 'Odoo', 'out'), path.join(distDir, '_round24', 'easyodoo'))
  await copyPublicSiteFrom(
    path.join(workspaceRoot, 'saas-management-platform', 'public'),
    path.join(distDir, '_management', 'saas-manager'),
  )

  const vercelStaticProjects = [
    { project: 'aireasoningbase', sourceDir: path.join(workspaceRoot, 'aireasoningbase.com', 'dist') },
    { project: 'ccswitch', sourceDir: path.join(workspaceRoot, 'cc-switch', 'dist') },
    { project: 'clauxel', sourceDir: path.join(workspaceRoot, 'clauxel', 'dist') },
    { project: 'multica', sourceDir: path.join(workspaceRoot, 'multica', 'dist') },
  ]

  for (const entry of vercelStaticProjects) {
    await copyPublicSiteFrom(entry.sourceDir, path.join(distDir, '_vercel', entry.project))
  }

  // <trendradar-diversified-sites-2026-05-26>
  // TrendRadar diversified static sites - 2026-05-26
  const diversifiedStaticProjects = [
    { project: 'a2adependencyinspector', sourceDir: path.join(workspaceRoot, 'a2adependencyinspector') },
    { project: 'a2aidentitytoll', sourceDir: path.join(workspaceRoot, 'a2aidentitytoll') },
    { project: 'a2areplayreceipt', sourceDir: path.join(workspaceRoot, 'a2areplayreceipt') },
    { project: 'activepiecesworkflow', sourceDir: path.join(workspaceRoot, 'activepiecesworkflow') },
    { project: 'agent-handoff-sla-board', sourceDir: path.join(workspaceRoot, 'agent-handoff-sla-board') },
    { project: 'agentdataboundary', sourceDir: path.join(workspaceRoot, 'agentdataboundary') },
    { project: 'agentearlyaccess', sourceDir: path.join(workspaceRoot, 'agentearlyaccess') },
    { project: 'agentic-rollback-planbook', sourceDir: path.join(workspaceRoot, 'agentic-rollback-planbook') },
    { project: 'agenticbudgetrouter', sourceDir: path.join(workspaceRoot, 'agenticbudgetrouter') },
    { project: 'agentichtmlexportqa', sourceDir: path.join(workspaceRoot, 'agentichtmlexportqa') },
    { project: 'agenticinboxdesk', sourceDir: path.join(workspaceRoot, 'agenticinboxdesk') },
    { project: 'agentmailrooms', sourceDir: path.join(workspaceRoot, 'agentmailrooms') },
    { project: 'agentmemorymcp', sourceDir: path.join(workspaceRoot, 'agentmemorymcp') },
    { project: 'agentmonitorrelay', sourceDir: path.join(workspaceRoot, 'agentmonitorrelay') },
    { project: 'agentscangate', sourceDir: path.join(workspaceRoot, 'agentscangate') },
    { project: 'agentskillupdategate', sourceDir: path.join(workspaceRoot, 'agentskillupdategate') },
    { project: 'ai-governance-eval-binder', sourceDir: path.join(workspaceRoot, 'ai-governance-eval-binder') },
    { project: 'ai-search-source-freshness', sourceDir: path.join(workspaceRoot, 'ai-search-source-freshness') },
    { project: 'ai-shopping-policy-watch', sourceDir: path.join(workspaceRoot, 'ai-shopping-policy-watch') },
    { project: 'aiactdisclosuredesk', sourceDir: path.join(workspaceRoot, 'aiactdisclosuredesk') },
    { project: 'aidevkitworkflow', sourceDir: path.join(workspaceRoot, 'aidevkitworkflow') },
    { project: 'aionuicowork', sourceDir: path.join(workspaceRoot, 'aionuicowork') },
    { project: 'aireviewsignal', sourceDir: path.join(workspaceRoot, 'aireviewsignal') },
    { project: 'aistudioandroidreleasegate', sourceDir: path.join(workspaceRoot, 'aistudioandroidreleasegate') },
    { project: 'aistudioworkspaceapproval', sourceDir: path.join(workspaceRoot, 'aistudioworkspaceapproval') },
    { project: 'aiwaiverdesk', sourceDir: path.join(workspaceRoot, 'aiwaiverdesk') },
    { project: 'androidcliagentgate', sourceDir: path.join(workspaceRoot, 'androidcliagentgate') },
    { project: 'antigravityextensiongate', sourceDir: path.join(workspaceRoot, 'antigravityextensiongate') },
    { project: 'antigravityrunledger', sourceDir: path.join(workspaceRoot, 'antigravityrunledger') },
    { project: 'arkonknowledge', sourceDir: path.join(workspaceRoot, 'arkonknowledge') },
    { project: 'askimodesk', sourceDir: path.join(workspaceRoot, 'askimodesk') },
    { project: 'autobrowserapproval', sourceDir: path.join(workspaceRoot, 'autobrowserapproval') },
    { project: 'axonhubgateway', sourceDir: path.join(workspaceRoot, 'axonhubgateway') },
    { project: 'bbbrowserstate', sourceDir: path.join(workspaceRoot, 'bbbrowserstate') },
    { project: 'bifrostgateway', sourceDir: path.join(workspaceRoot, 'bifrostgateway') },
    { project: 'browserspendguard', sourceDir: path.join(workspaceRoot, 'browserspendguard') },
    { project: 'bumblebeereceipt', sourceDir: path.join(workspaceRoot, 'bumblebeereceipt') },
    { project: 'byterovermemory', sourceDir: path.join(workspaceRoot, 'byterovermemory') },
    { project: 'c2padisclosure', sourceDir: path.join(workspaceRoot, 'c2padisclosure') },
    { project: 'c2paintake', sourceDir: path.join(workspaceRoot, 'c2paintake') },
    { project: 'chromedevtoolsmcp', sourceDir: path.join(workspaceRoot, 'chromedevtoolsmcp') },
    { project: 'claudecodereplacement', sourceDir: path.join(workspaceRoot, 'claudecodereplacement') },
    { project: 'clawmanagerfleet', sourceDir: path.join(workspaceRoot, 'clawmanagerfleet') },
    { project: 'clianythingharness', sourceDir: path.join(workspaceRoot, 'clianythingharness') },
    { project: 'codegraphcontext', sourceDir: path.join(workspaceRoot, 'codegraphcontext') },
    { project: 'codegworkspace', sourceDir: path.join(workspaceRoot, 'codegworkspace') },
    { project: 'codex-deploy-readiness', sourceDir: path.join(workspaceRoot, 'codex-deploy-readiness') },
    { project: 'codexrunledger', sourceDir: path.join(workspaceRoot, 'codexrunledger') },
    { project: 'context7docs', sourceDir: path.join(workspaceRoot, 'context7docs') },
    { project: 'coolifylaunch', sourceDir: path.join(workspaceRoot, 'coolifylaunch') },
    { project: 'cookiefreeanalytics', sourceDir: path.join(workspaceRoot, 'cookiefreeanalytics') },
    { project: 'copilotcliswitchgate', sourceDir: path.join(workspaceRoot, 'copilotcliswitchgate') },
    { project: 'copilotconnectorledger', sourceDir: path.join(workspaceRoot, 'copilotconnectorledger') },
    { project: 'coralquery', sourceDir: path.join(workspaceRoot, 'coralquery') },
    { project: 'cozeloopops', sourceDir: path.join(workspaceRoot, 'cozeloopops') },
    { project: 'cursor-composer-cost-lab', sourceDir: path.join(workspaceRoot, 'cursor-composer-cost-lab') },
    { project: 'decapodkernel', sourceDir: path.join(workspaceRoot, 'decapodkernel') },
    { project: 'devinsessionboard', sourceDir: path.join(workspaceRoot, 'devinsessionboard') },
    { project: 'dograhvoice', sourceDir: path.join(workspaceRoot, 'dograhvoice') },
    { project: 'dyadteambuilder', sourceDir: path.join(workspaceRoot, 'dyadteambuilder') },
    { project: 'equiblesagent', sourceDir: path.join(workspaceRoot, 'equiblesagent') },
    { project: 'evalscopebench', sourceDir: path.join(workspaceRoot, 'evalscopebench') },
    { project: 'fastmcpruntime', sourceDir: path.join(workspaceRoot, 'fastmcpruntime') },
    { project: 'futureagievals', sourceDir: path.join(workspaceRoot, 'futureagievals') },
    { project: 'geminicallreceipt', sourceDir: path.join(workspaceRoot, 'geminicallreceipt') },
    { project: 'geminiclimigrationdesk', sourceDir: path.join(workspaceRoot, 'geminiclimigrationdesk') },
    { project: 'geminiomniapproval', sourceDir: path.join(workspaceRoot, 'geminiomniapproval') },
    { project: 'geminiomnirights', sourceDir: path.join(workspaceRoot, 'geminiomnirights') },
    { project: 'geminisparktaskboard', sourceDir: path.join(workspaceRoot, 'geminisparktaskboard') },
    { project: 'geminiupgradeqa', sourceDir: path.join(workspaceRoot, 'geminiupgradeqa') },
    { project: 'genaispanmapper', sourceDir: path.join(workspaceRoot, 'genaispanmapper') },
    { project: 'gomodelgateway', sourceDir: path.join(workspaceRoot, 'gomodelgateway') },
    { project: 'headroomcompress', sourceDir: path.join(workspaceRoot, 'headroomcompress') },
    { project: 'hermesagentrun', sourceDir: path.join(workspaceRoot, 'hermesagentrun') },
    { project: 'holaosworkstream', sourceDir: path.join(workspaceRoot, 'holaosworkstream') },
    { project: 'hyperframesrender', sourceDir: path.join(workspaceRoot, 'hyperframesrender') },
    { project: 'inkeepagents', sourceDir: path.join(workspaceRoot, 'inkeepagents') },
    { project: 'intentkitcluster', sourceDir: path.join(workspaceRoot, 'intentkitcluster') },
    { project: 'jcodeharness', sourceDir: path.join(workspaceRoot, 'jcodeharness') },
    { project: 'kirowebreleasebinder', sourceDir: path.join(workspaceRoot, 'kirowebreleasebinder') },
    { project: 'kreuzbergextract', sourceDir: path.join(workspaceRoot, 'kreuzbergextract') },
    { project: 'lixversion', sourceDir: path.join(workspaceRoot, 'lixversion') },
    { project: 'mastraworkflow', sourceDir: path.join(workspaceRoot, 'mastraworkflow') },
    { project: 'mcp-directory-radar', sourceDir: path.join(workspaceRoot, 'mcp-directory-radar') },
    { project: 'mcpcsessionrelay', sourceDir: path.join(workspaceRoot, 'mcpcsessionrelay') },
    { project: 'mcpdeprecation', sourceDir: path.join(workspaceRoot, 'mcpdeprecation') },
    { project: 'mcpgatewaydesk', sourceDir: path.join(workspaceRoot, 'mcpgatewaydesk') },
    { project: 'mcpoauthscopegate', sourceDir: path.join(workspaceRoot, 'mcpoauthscopegate') },
    { project: 'mcpscopeconsent', sourceDir: path.join(workspaceRoot, 'mcpscopeconsent') },
    { project: 'mcptoollicense', sourceDir: path.join(workspaceRoot, 'mcptoollicense') },
    { project: 'mcpuptimeledger', sourceDir: path.join(workspaceRoot, 'mcpuptimeledger') },
    { project: 'nangointegrationops', sourceDir: path.join(workspaceRoot, 'nangointegrationops') },
    { project: 'nexentagent', sourceDir: path.join(workspaceRoot, 'nexentagent') },
    { project: 'nextcloudteammcp', sourceDir: path.join(workspaceRoot, 'nextcloudteammcp') },
    { project: 'notebooksourceqa', sourceDir: path.join(workspaceRoot, 'notebooksourceqa') },
    { project: 'novamirawpops', sourceDir: path.join(workspaceRoot, 'novamirawpops') },
    { project: 'openagentwatch', sourceDir: path.join(workspaceRoot, 'openagentwatch') },
    { project: 'open-llm-vtuber', sourceDir: path.join(workspaceRoot, 'open-llm-vtuber', 'public') },
    { project: 'opendesignguard', sourceDir: path.join(workspaceRoot, 'opendesignguard') },
    { project: 'openlitops', sourceDir: path.join(workspaceRoot, 'openlitops') },
    { project: 'paperclipcompany', sourceDir: path.join(workspaceRoot, 'paperclipcompany') },
    { project: 'playwrightselectorguard', sourceDir: path.join(workspaceRoot, 'playwrightselectorguard') },
    { project: 'playwritermcp', sourceDir: path.join(workspaceRoot, 'playwritermcp') },
    { project: 'policyproofdesk', sourceDir: path.join(workspaceRoot, 'policyproofdesk') },
    { project: 'pptmasterdeck', sourceDir: path.join(workspaceRoot, 'pptmasterdeck') },
    { project: 'promptfixreceipt', sourceDir: path.join(workspaceRoot, 'promptfixreceipt') },
    { project: 'protocolanalyzerai', sourceDir: path.join(workspaceRoot, 'protocolanalyzerai') },
    { project: 'pydanticcontract', sourceDir: path.join(workspaceRoot, 'pydanticcontract') },
    { project: 'rtkcontext', sourceDir: path.join(workspaceRoot, 'rtkcontext') },
    { project: 'safety-replay-gate', sourceDir: path.join(workspaceRoot, 'safety-replay-gate') },
    { project: 'sbproxytraffic', sourceDir: path.join(workspaceRoot, 'sbproxytraffic') },
    { project: 'schema-drift-gate', sourceDir: path.join(workspaceRoot, 'schema-drift-gate') },
    { project: 'searchpricewatch', sourceDir: path.join(workspaceRoot, 'searchpricewatch') },
    { project: 'semblecodesearchgate', sourceDir: path.join(workspaceRoot, 'semblecodesearchgate') },
    { project: 'shipswiftcomponents', sourceDir: path.join(workspaceRoot, 'shipswiftcomponents') },
    { project: 'shopanswertrace', sourceDir: path.join(workspaceRoot, 'shopanswertrace') },
    { project: 'simstudiohost', sourceDir: path.join(workspaceRoot, 'simstudiohost') },
    { project: 'skillshubsync', sourceDir: path.join(workspaceRoot, 'skillshubsync') },
    { project: 'skybridgepackager', sourceDir: path.join(workspaceRoot, 'skybridgepackager') },
    { project: 'solaceagentmesh', sourceDir: path.join(workspaceRoot, 'solaceagentmesh') },
    { project: 'speckitacceptance', sourceDir: path.join(workspaceRoot, 'speckitacceptance') },
    { project: 'sregymgate', sourceDir: path.join(workspaceRoot, 'sregymgate') },
    { project: 'statewrightgate', sourceDir: path.join(workspaceRoot, 'statewrightgate') },
    { project: 'taskorchestratorgate', sourceDir: path.join(workspaceRoot, 'taskorchestratorgate') },
    { project: 'toolcallwitness', sourceDir: path.join(workspaceRoot, 'toolcallwitness') },
    { project: 'tracepiishield', sourceDir: path.join(workspaceRoot, 'tracepiishield') },
    { project: 'twentyrevenue', sourceDir: path.join(workspaceRoot, 'twentyrevenue') },
    { project: 'unitymcptest', sourceDir: path.join(workspaceRoot, 'unitymcptest') },
    { project: 'universalcartmerchantgate', sourceDir: path.join(workspaceRoot, 'universalcartmerchantgate') },
    { project: 'veocreditwaste', sourceDir: path.join(workspaceRoot, 'veocreditwaste') },
    { project: 'veoscenecontinuity', sourceDir: path.join(workspaceRoot, 'veoscenecontinuity') },
    { project: 'videoclaimsqa', sourceDir: path.join(workspaceRoot, 'videoclaimsqa') },
    { project: 'vm0workqueue', sourceDir: path.join(workspaceRoot, 'vm0workqueue') },
    { project: 'voltagentconsole', sourceDir: path.join(workspaceRoot, 'voltagentconsole') },
    { project: 'webclawextract', sourceDir: path.join(workspaceRoot, 'webclawextract') },
    { project: 'webmcpactionreceipt', sourceDir: path.join(workspaceRoot, 'webmcpactionreceipt') },
    { project: 'yaolaunchroom', sourceDir: path.join(workspaceRoot, 'yaolaunchroom') },
    { project: 'zeroidagent', sourceDir: path.join(workspaceRoot, 'zeroidagent') },
    { project: 'zerolangcompiler', sourceDir: path.join(workspaceRoot, 'zerolangcompiler') },
    { project: 'vibe-coding/dist', sourceDir: path.join(workspaceRoot, 'vibe-coding/dist') },
  ]

  for (const entry of diversifiedStaticProjects) {
    await copyPublicSiteFrom(entry.sourceDir, path.join(distDir, '_diversified', entry.project))
  }
  // </trendradar-diversified-sites-2026-05-26>

  async function copyPublicSite(project, targetDir) {
    const sourceDir = path.join(workspaceRoot, project)
    return copyPublicSiteFrom(sourceDir, targetDir)
  }

  async function copyPublicSiteFrom(sourceDir, targetDir) {
    await fs.rm(targetDir, { recursive: true, force: true })
    await fs.mkdir(targetDir, { recursive: true })
    await copyDirectory(sourceDir, targetDir)
  }

  async function copyDirectory(sourceDir, targetDir) {
    const entries = await fs.readdir(sourceDir, { withFileTypes: true })
    for (const entry of entries) {
      if (shouldSkipRoundSiteEntry(entry.name)) continue
      const sourcePath = path.join(sourceDir, entry.name)
      const targetPath = path.join(targetDir, entry.name)
      if (entry.isDirectory()) {
        await fs.mkdir(targetPath, { recursive: true })
        await copyDirectory(sourcePath, targetPath)
      } else if (entry.isFile()) {
        await fs.copyFile(sourcePath, targetPath)
      }
    }
  }

  function shouldSkipRoundSiteEntry(name) {
    if (name === '.well-known') return false
    if (name.startsWith('.')) return true
    return [
      'functions',
      'worker',
      'node_modules',
      'package.json',
      'package-lock.json',
      'README.md',
      'scripts',
      'test-results',
      'WEBSITE_CHANGELOG.md',
      'wrangler.toml',
      'wrangler.worker.toml',
    ].includes(name) || /^analytics-last-1d-/.test(name)
  }
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
