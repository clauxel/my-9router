import type { KeywordPage } from '../content/keyword-pages'
import type { RouteView } from './routing'

const liveOrigin = 'https://9router.space'
const siteName = '9router Space'
const defaultTitle = '9router Space - AI Router Control Plane for Codex, Cursor, and Models'
const defaultDescription =
  'Plan a managed 9router rollout for Codex, Cursor, Antigravity, Docker, npm installs, fallback models, token savings, and AI routing operations.'

const canonicalLinkId = 'nine-router-canonical-link'
const structuredDataScriptId = 'nine-router-structured-data'

type StructuredDataRecord = Record<string, unknown>

export type SeoDocument = {
  title: string
  description: string
  canonicalUrl: string
  robots: string
  structuredData: StructuredDataRecord[]
}

function normalizePathname(pathname: string) {
  const normalized = pathname.replace(/\/+$/, '')
  return normalized || '/'
}

function resolveCanonicalOrigin(origin: string) {
  try {
    const url = new URL(origin)
    if (url.hostname.endsWith('.pages.dev') || url.hostname.endsWith('.workers.dev')) {
      return url.origin
    }
  } catch {}

  return liveOrigin
}

function buildCanonicalUrl(origin: string, pathname: string) {
  const normalized = normalizePathname(pathname)
  const canonicalPath = normalized === '/' ? '/' : `${normalized}/`
  return new URL(canonicalPath, `${resolveCanonicalOrigin(origin)}/`).toString()
}

function buildWebPageStructuredData(title: string, description: string, canonicalUrl: string): StructuredDataRecord {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: canonicalUrl,
  }
}

function buildBreadcrumb(origin: string, pathname: string, label: string): StructuredDataRecord {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: buildCanonicalUrl(origin, '/') },
      { '@type': 'ListItem', position: 2, name: label, item: buildCanonicalUrl(origin, pathname) },
    ],
  }
}

function buildFaqStructuredData(page: KeywordPage): StructuredDataRecord {
  return {
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
  }
}

export function buildSeoDocument(args: {
  pathname: string
  routeView: RouteView
  publicAppOrigin: string
  keywordPage: KeywordPage | null
}): SeoDocument {
  const { pathname, routeView, publicAppOrigin, keywordPage } = args
  const normalizedPath = normalizePathname(pathname)
  const canonicalUrl = buildCanonicalUrl(publicAppOrigin, normalizedPath)

  if (routeView === 'home') {
    return {
      title: defaultTitle,
      description: defaultDescription,
      canonicalUrl,
      robots: 'index,follow',
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
          url: canonicalUrl,
        },
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: siteName,
          url: canonicalUrl,
          potentialAction: {
            '@type': 'SearchAction',
            target: `${canonicalUrl}?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        },
        buildWebPageStructuredData(defaultTitle, defaultDescription, canonicalUrl),
      ],
    }
  }

  if (routeView === 'pricing') {
    const title = '9router Space Pricing | Pro Annual AI Router Rollout'
    const description =
      'Compare 9router Space Starter, Pro, and Operations plans. Pro annual is selected by default and annual billing is 50% cheaper than monthly.'
    return {
      title,
      description,
      canonicalUrl,
      robots: 'index,follow',
      structuredData: [
        buildWebPageStructuredData(title, description, canonicalUrl),
        {
          '@context': 'https://schema.org',
          '@type': 'OfferCatalog',
          name: '9router Space pricing',
          url: canonicalUrl,
        },
      ],
    }
  }

  if (routeView === 'keyword' && keywordPage) {
    const title = `${keywordPage.title} | ${siteName}`
    const keywordCanonical = buildCanonicalUrl(publicAppOrigin, keywordPage.path)
    return {
      title,
      description: keywordPage.description,
      canonicalUrl: keywordCanonical,
      robots: 'index,follow',
      structuredData: [
        buildWebPageStructuredData(title, keywordPage.description, keywordCanonical),
        buildBreadcrumb(publicAppOrigin, keywordPage.path, keywordPage.h1),
        buildFaqStructuredData(keywordPage),
      ],
    }
  }

  if (routeView === 'privacy') {
    const title = `Privacy | ${siteName}`
    const description = 'How 9router Space handles analytics, checkout metadata, and managed-site interactions.'
    return {
      title,
      description,
      canonicalUrl,
      robots: 'index,follow',
      structuredData: [buildWebPageStructuredData(title, description, canonicalUrl)],
    }
  }

  if (routeView === 'terms') {
    const title = `Terms | ${siteName}`
    const description = 'Terms for using the 9router Space managed site, hosted payment flow, and related support.'
    return {
      title,
      description,
      canonicalUrl,
      robots: 'index,follow',
      structuredData: [buildWebPageStructuredData(title, description, canonicalUrl)],
    }
  }

  if (routeView === 'checkout-done') {
    const title = `Checkout | ${siteName}`
    return {
      title,
      description: 'Completing your 9router Space checkout.',
      canonicalUrl,
      robots: 'noindex,nofollow',
      structuredData: [buildWebPageStructuredData(title, 'Checkout completion.', canonicalUrl)],
    }
  }

  return {
    title: `Page not found | ${siteName}`,
    description: 'The requested 9router Space page was not found.',
    canonicalUrl,
    robots: 'noindex,nofollow',
    structuredData: [buildWebPageStructuredData('Page not found', 'Missing page.', canonicalUrl)],
  }
}

function upsertMeta(attributeName: 'name' | 'property', attributeValue: string, content: string) {
  let element = document.head.querySelector(`meta[${attributeName}="${attributeValue}"]`)

  if (!(element instanceof HTMLMetaElement)) {
    element = document.createElement('meta')
    element.setAttribute(attributeName, attributeValue)
    document.head.appendChild(element)
  }

  element.setAttribute('content', content)
}

function upsertCanonicalLink(href: string) {
  let element =
    (document.head.querySelector(`#${canonicalLinkId}`) as HTMLLinkElement | null) ??
    (document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null)

  if (!(element instanceof HTMLLinkElement)) {
    element = document.createElement('link')
    document.head.appendChild(element)
  }

  element.id = canonicalLinkId
  element.rel = 'canonical'
  element.href = href
}

function upsertStructuredData(structuredData: StructuredDataRecord[]) {
  let element = document.head.querySelector(`#${structuredDataScriptId}`) as HTMLScriptElement | null

  if (!(element instanceof HTMLScriptElement)) {
    element = document.createElement('script')
    element.id = structuredDataScriptId
    element.type = 'application/ld+json'
    document.head.appendChild(element)
  }

  const payload =
    structuredData.length <= 1
      ? structuredData[0] ?? {}
      : {
          '@context': 'https://schema.org',
          '@graph': structuredData.map((item) => {
            const { '@context': _context, ...rest } = item
            return rest
          }),
        }

  element.textContent = JSON.stringify(payload)
}

export function syncSeoDocument(seo: SeoDocument) {
  document.title = seo.title
  upsertMeta('name', 'description', seo.description)
  upsertMeta('name', 'robots', seo.robots)
  upsertMeta('property', 'og:type', 'website')
  upsertMeta('property', 'og:site_name', siteName)
  upsertMeta('property', 'og:title', seo.title)
  upsertMeta('property', 'og:description', seo.description)
  upsertMeta('property', 'og:url', seo.canonicalUrl)
  upsertMeta('name', 'twitter:card', 'summary_large_image')
  upsertMeta('name', 'twitter:title', seo.title)
  upsertMeta('name', 'twitter:description', seo.description)
  upsertCanonicalLink(seo.canonicalUrl)
  upsertStructuredData(seo.structuredData)
}
