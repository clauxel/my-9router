import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  Check,
  CheckCircle2,
  ChevronRight,
  Clipboard,
  Cloud,
  Code2,
  DollarSign,
  ExternalLink,
  FileText,
  Github,
  Layers3,
  LockKeyhole,
  Network,
  PackageCheck,
  Play,
  Rocket,
  Route,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  X,
  Zap,
} from 'lucide-react'

import { findKeywordPageByPath, keywordPages, type KeywordPage } from './content/keyword-pages'
import { trackEvent, trackPageView } from './lib/analytics'
import {
  analyzeRouterSelection,
  defaultRouterSelection,
  deploymentOptions,
  fallbackOptions,
  primaryOptions,
  teamOptions,
  tokenPolicyOptions,
  toolOptions,
  type Option,
  type PlanId,
  type RouterSelection,
} from './lib/mission'
import { buildSeoDocument, syncSeoDocument } from './lib/seo'
import { deriveRouteView, normalizePathname, scrollToHashTarget, type RouteView } from './lib/routing'

const defaultPublicAppOrigin = 'https://9router.space'
const pagesApiBaseUrl = 'https://my-9router.yangdengkui01.workers.dev'

type Billing = 'monthly' | 'annual'

type CheckoutModalState = {
  planId: PlanId
  billing: Billing
  loadingKey: string
  status: 'loading' | 'popup' | 'retry'
  checkoutUrl?: string
}

const ctaPrimary = 'Choose Pro annual'
const ctaCheckout = 'Continue with Pro'

type PricingFeature = {
  label: string
  included?: boolean
}

const plans: Array<{
  id: PlanId
  name: string
  shortName: string
  tagline: string
  monthlyUsd: number
  annualDiscountMultiplier?: number
  bullets: PricingFeature[]
  popular?: boolean
}> = [
  {
    id: 'starter',
    name: 'Starter',
    shortName: 'Starter',
    tagline: 'Perfect for individuals validating one 9router workflow for the first time.',
    monthlyUsd: 9,
    annualDiscountMultiplier: 1,
    bullets: [
      { label: 'One route plan' },
      { label: 'Npm or local install review' },
      { label: 'Basic provider stack' },
      { label: 'Email support' },
      { label: 'Docker persistence review', included: false },
      { label: 'RTK and fallback policy', included: false },
      { label: 'Dedicated rollout support', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    shortName: 'Pro',
    tagline: 'For developers and product teams running regular 9router routing workflows.',
    monthlyUsd: 29,
    annualDiscountMultiplier: 0.5,
    popular: true,
    bullets: [
      { label: 'Codex, Cursor, and Antigravity route plan' },
      { label: 'Docker persistence review' },
      { label: 'RTK and fallback policy' },
      { label: 'Provider and budget controls' },
      { label: 'Priority onboarding' },
      { label: 'Security and log posture' },
      { label: 'Custom deployment', included: false },
    ],
  },
  {
    id: 'ops',
    name: 'Enterprise',
    shortName: 'Enterprise',
    tagline: 'For organizations needing secured endpoints, custom rollout, and dedicated support.',
    monthlyUsd: 59,
    annualDiscountMultiplier: 1,
    bullets: [
      { label: 'Cloud endpoint planning' },
      { label: 'Provider and budget controls' },
      { label: 'Security and log posture' },
      { label: 'Dedicated rollout support' },
      { label: 'Multi-team rollout governance' },
      { label: 'Custom deployment review' },
      { label: 'SLA and compliance support' },
    ],
  },
]

const proofItems = [
  { label: 'Default plan', value: 'Pro', detail: 'Middle tier selected before checkout' },
  { label: 'Pro annual savings', value: '50%', detail: 'Pro yearly checkout is selected by default' },
  { label: 'Token posture', value: '20-40%', detail: 'RTK-style tool output savings' },
  { label: 'Route depth', value: '3 tiers', detail: 'Subscription, cheap, then free continuity' },
]

const workflowCards = [
  {
    title: 'One endpoint for coding tools',
    body: 'Point Codex, Cursor, Antigravity, Claude Code, Cline, and compatible clients at a planned /v1 route.',
    icon: <Network size={21} />,
  },
  {
    title: 'Provider fallback without guesswork',
    body: 'Make the route order visible before buyers pay: subscription quota, lower-cost model, then free continuity.',
    icon: <Route size={21} />,
  },
  {
    title: 'Token spend under control',
    body: 'Keep RTK enabled for diffs, logs, grep output, and other tool-heavy coding sessions.',
    icon: <DollarSign size={21} />,
  },
  {
    title: 'Credentials treated as operations',
    body: 'Plan dashboard auth, API keys, persistent data, request logs, and deployment boundaries before team use.',
    icon: <ShieldCheck size={21} />,
  },
]

const trustLinks = [
  {
    label: '9router GitHub',
    href: '/9router-github',
    icon: <Github size={17} />,
    internal: true,
  },
  {
    label: 'Docker guide',
    href: '/9router-docker',
    icon: <Boxes size={17} />,
    internal: true,
  },
  {
    label: 'Upstream source',
    href: 'https://github.com/decolua/9router',
    icon: <ExternalLink size={17} />,
  },
]

const legalPrivacySections = [
  {
    title: 'What we collect',
    paragraphs: [
      '9router Space collects only information reasonably needed to operate this website, process checkout, measure site performance, prevent abuse, and respond to support requests.',
      'This may include page views, referral and UTM data, browser and device information, approximate location derived from network data, checkout metadata, support emails, and information you intentionally submit.',
      'The public router planner runs from your browser selections. It does not require you to upload provider API keys, OAuth tokens, private repositories, secrets, source code, credentials, or production data.',
    ],
  },
  {
    title: 'How we use information',
    paragraphs: [
      'We use analytics to understand which pages, plan choices, and checkout actions help visitors make a confident purchase decision.',
      'We use checkout metadata to create payment sessions, confirm purchases, return users to the homepage, provide onboarding, prevent fraud, and handle support.',
      'We do not sell personal information. We do not use private repository content for model training through this public website because the public website does not collect repository content.',
    ],
  },
  {
    title: 'Service providers',
    paragraphs: [
      'Cloudflare supports hosting, routing, security, and analytics infrastructure. Creem supports hosted checkout and payment processing.',
      'Payment details are handled by the payment provider. We do not ask users to send card numbers, passwords, provider API keys, OAuth tokens, or repository secrets by email or through this public planner.',
      'Third-party services process information under their own terms and privacy practices. Do not proceed with checkout or external links if you do not accept those practices.',
    ],
  },
  {
    title: 'Security, retention, and deletion',
    paragraphs: [
      'We use reasonable administrative, technical, and organizational safeguards appropriate for a lightweight SaaS marketing and checkout site.',
      'No internet service can be guaranteed perfectly secure. Users are responsible for avoiding the submission of credentials, secrets, regulated data, or highly sensitive information unless a signed, appropriate agreement says otherwise.',
      'We retain information only as long as reasonably needed for the purposes described here, including tax, accounting, fraud prevention, security, dispute handling, and legal compliance.',
    ],
  },
  {
    title: 'Your choices and rights',
    paragraphs: [
      'Depending on your location, you may have rights to request access, correction, deletion, portability, restriction, or objection regarding personal information we control.',
      'California and other privacy laws may provide additional rights when their thresholds and conditions apply. We will not discriminate against users for exercising applicable privacy rights.',
      'To make a privacy or support request, email support@aigeamy.com. We may need to verify the request before acting on it.',
    ],
  },
  {
    title: 'Children, changes, and contact',
    paragraphs: [
      '9router Space is intended for business and developer audiences and is not directed to children under 13.',
      'We may update this policy when the product, providers, laws, or operations change. The version posted on this page controls from the time it is published.',
      'Questions about privacy, support, or data handling should be sent to support@aigeamy.com.',
    ],
  },
]

const legalTermsSections = [
  {
    title: 'Acceptance and service scope',
    paragraphs: [
      'By accessing 9router Space, using the planner, opening checkout, purchasing a plan, or continuing to use the service, you agree to these Terms.',
      '9router Space provides a website, route planner, pricing flow, hosted checkout, and related onboarding for managed 9router adoption.',
      'This site is not the official upstream 9router project and is not a promise that an AI model, coding tool, provider, or router configuration will complete every task, operate without interruption, reduce every bill, or be safe without human review.',
    ],
  },
  {
    title: 'User responsibilities',
    paragraphs: [
      'You are responsible for the providers, accounts, prompts, repositories, data, credentials, API keys, OAuth tokens, commands, deployment choices, and instructions you provide or authorize.',
      'Do not upload or disclose API keys, passwords, private keys, regulated data, confidential third-party information, export-controlled material, or data you are not allowed to process.',
      'Any workflow that can read files, write files, run shell commands, call external tools, send messages, deploy code, route provider traffic, or affect production systems must be operated with explicit permissions and human review.',
    ],
  },
  {
    title: 'AI, routing, and technical output',
    paragraphs: [
      'AI-assisted output, route recommendations, setup notes, provider suggestions, and generated materials may be incomplete, inaccurate, insecure, infringing, unsuitable, unavailable, or wrong.',
      '9router Space does not provide legal, financial, medical, security, compliance, investment, or professional advice. Any examples, plans, summaries, or generated materials are informational only.',
      'You are solely responsible for deciding whether any code, configuration, provider route, payment, deployment, or operational action is safe, lawful, and appropriate for your use case.',
    ],
  },
  {
    title: 'Payments, renewals, and refunds',
    paragraphs: [
      'Payments are processed by Creem in a hosted popup window. Successful checkouts return the user to the homepage.',
      'Displayed Pro annual pricing reflects a 50% discount versus the Pro monthly run-rate. Starter and Enterprise can also be purchased for a fixed period without automatic renewal. Prices, plan names, features, and availability may change before purchase.',
      'Unless a separate written agreement says otherwise, purchases are final to the maximum extent permitted by law. If the payment provider, consumer law, or a written policy requires a refund, that required rule controls.',
      'Chargebacks, payment abuse, or attempted circumvention of checkout may result in suspension, cancellation, or refusal of service.',
    ],
  },
  {
    title: 'Prohibited use',
    paragraphs: [
      'You may not use 9router Space to violate law, infringe rights, attack systems, distribute malware, bypass access controls, scrape where prohibited, spam, impersonate others, misrepresent AI output, or process data without authority.',
      'You may not reverse engineer, overload, interfere with, resell, frame, copy, or exploit the service except as expressly permitted in writing.',
      'We may suspend or terminate access, refuse checkout, preserve evidence, or cooperate with lawful requests when we believe use is unsafe, abusive, fraudulent, infringing, or unlawful.',
    ],
  },
  {
    title: 'Third-party services',
    paragraphs: [
      'Cloudflare, Creem, GitHub, npm, Docker, model providers, coding tools, infrastructure providers, and other third-party services may be involved in hosting, checkout, references, integrations, or customer workflows.',
      'We are not responsible for third-party services, third-party outages, payment provider decisions, external repositories, external links, provider pricing, account bans, rate limits, or third-party terms.',
      'Your use of third-party services is governed by the applicable third-party terms, privacy policies, account rules, and fees.',
    ],
  },
  {
    title: 'No warranties',
    paragraphs: [
      '9router Space is provided as is and as available. To the maximum extent permitted by law, we disclaim all warranties, whether express, implied, statutory, or otherwise.',
      'We do not warrant uninterrupted service, error-free operation, complete security, merchantability, fitness for a particular purpose, non-infringement, accuracy of AI output, provider availability, token savings, revenue results, rankings, conversion results, or business outcomes.',
      'You use the service at your own risk and remain responsible for backups, testing, review, security, legal compliance, provider bills, and production decisions.',
    ],
  },
  {
    title: 'Limitation of liability',
    paragraphs: [
      'To the maximum extent permitted by law, 9router Space and its operators, affiliates, suppliers, and service providers will not be liable for indirect, incidental, special, consequential, exemplary, punitive, or lost-profit damages.',
      'To the maximum extent permitted by law, total liability for any claim relating to the service is limited to the greater of 100 USD or the amount you paid for 9router Space in the three months before the event giving rise to the claim.',
      'These limits apply whether the claim is based on contract, tort, negligence, strict liability, statute, warranty, or any other theory, even if a remedy fails of its essential purpose.',
    ],
  },
  {
    title: 'Indemnity',
    paragraphs: [
      'You agree to defend, indemnify, and hold harmless 9router Space and its operators, affiliates, suppliers, and service providers from claims, damages, liabilities, losses, costs, and fees arising from your use of the service.',
      'This includes claims arising from your data, repositories, credentials, prompts, provider accounts, generated output, production use, third-party accounts, violation of law, infringement, breach of these Terms, or unauthorized use of credentials or systems.',
    ],
  },
  {
    title: 'Disputes',
    paragraphs: [
      'Before filing a claim, you agree to email support@aigeamy.com and give us 30 days to try to resolve the dispute informally.',
      'To the maximum extent permitted by law, disputes must be resolved individually and not as a class, collective, consolidated, private attorney general, or representative action.',
      'To the maximum extent permitted by law, disputes will be resolved by binding arbitration or the courts with proper jurisdiction for the operator, and you waive jury trial where that waiver is enforceable.',
      'If any part of these dispute terms is unenforceable, the remaining provisions continue to apply to the maximum extent permitted by law.',
    ],
  },
  {
    title: 'Changes, termination, and contact',
    paragraphs: [
      'We may update these Terms, change or discontinue features, refuse transactions, suspend access, or terminate service when reasonably necessary for security, legal, operational, abuse-prevention, or business reasons.',
      'If a provision is unenforceable, the rest of these Terms remains effective. A failure to enforce a provision is not a waiver.',
      'Questions, notices, support requests, and dispute notices should be sent to support@aigeamy.com.',
    ],
  },
]

function formatMoney(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value)
}

function resolveApiBaseUrl() {
  const configured = (import.meta.env.VITE_API_BASE_URL ?? '').trim().replace(/\/+$/, '')
  if (configured) return configured
  if (window.location.hostname.endsWith('.pages.dev')) return pagesApiBaseUrl
  return ''
}

function resolveApiUrl(path: string) {
  const apiBaseUrl = resolveApiBaseUrl()
  return apiBaseUrl ? `${apiBaseUrl}${path}` : path
}

async function readJsonResponse<T>(response: Response): Promise<T | null> {
  const rawText = await response.text()
  if (!rawText.trim()) return null
  try {
    return JSON.parse(rawText) as T
  } catch {
    return null
  }
}

async function createCheckoutSession(planId: PlanId, billing: Billing, endpoint = '/api/checkout') {
  const response = await fetch(resolveApiUrl(endpoint), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ planId, billing }),
  })

  const payload = await readJsonResponse<{ ok?: boolean; checkoutUrl?: string; error?: string }>(response)
  if (!response.ok || !payload?.ok || !payload.checkoutUrl) {
    throw new Error(payload?.error || 'Checkout could not be started.')
  }

  return payload.checkoutUrl
}

function openCenteredCheckoutWindow() {
  const width = 560
  const height = 760
  const left = Math.max(0, Math.round(window.screenX + (window.outerWidth - width) / 2))
  const top = Math.max(0, Math.round(window.screenY + (window.outerHeight - height) / 2))
  const popup = window.open(
    'about:blank',
    'nine-router-checkout',
    `popup=yes,width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`,
  )

  if (popup) {
    try {
      popup.document.title = 'Opening secure checkout'
      popup.document.body.innerHTML =
        '<main style="min-height:100vh;display:grid;place-items:center;background:#101820;color:#f8fafc;font-family:ui-sans-serif,system-ui,sans-serif;text-align:center;padding:32px"><div><h1 style="font-size:22px;margin:0 0 8px">Opening secure checkout...</h1><p style="margin:0;color:#cbd5e1">Your 9router Space payment window is being prepared.</p></div></main>'
    } catch {
      /* Existing named checkout windows can be cross-origin. */
    }
  }

  return popup
}

function sendPopupToCheckout(popup: Window | null, url: string) {
  if (!popup || popup.closed) return false

  try {
    popup.location.replace(url)
    popup.focus()
    return true
  } catch {
    return false
  }
}

function useRouteSignal() {
  const [pathname, setPathname] = useState(() => window.location.pathname)
  const [search, setSearch] = useState(() => window.location.search)

  function navigate(to: string) {
    const url = new URL(to, window.location.origin)
    window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`)
    setPathname(url.pathname)
    setSearch(url.search)

    if (url.hash) {
      requestAnimationFrame(() => scrollToHashTarget(url.hash))
      return
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    const onPop = () => {
      setPathname(window.location.pathname)
      setSearch(window.location.search)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  return { pathname, search, navigate }
}

function CheckoutDoneBridge({ publicAppOrigin }: { publicAppOrigin: string }) {
  useEffect(() => {
    const origin = window.location.origin || new URL(publicAppOrigin).origin

    if (window.parent !== window) {
      window.parent.postMessage({ type: 'nine-router-checkout-complete' }, origin)
      return
    }

    if (window.opener) {
      try {
        window.opener.postMessage({ type: 'nine-router-checkout-complete' }, origin)
      } catch {
        /* The opener may be closed or cross-origin. */
      }
      window.close()
      return
    }

    window.location.replace(`${origin}/?payment=success`)
  }, [publicAppOrigin])

  return (
    <main className="nr-main">
      <section className="nr-center-panel">
        <p className="nr-eyebrow">Checkout</p>
        <h1>Finishing checkout...</h1>
        <p className="nr-muted">You will return to the 9router Space homepage when the hosted payment session closes.</p>
      </section>
    </main>
  )
}

export default function App() {
  const { pathname, search, navigate } = useRouteSignal()
  const routeView: RouteView = useMemo(() => deriveRouteView(pathname), [pathname])
  const normalizedPath = normalizePathname(pathname)
  const keywordPage = useMemo(() => findKeywordPageByPath(pathname), [pathname])

  const [publicAppOrigin, setPublicAppOrigin] = useState(defaultPublicAppOrigin)
  const [headerCompact, setHeaderCompact] = useState(() => window.scrollY > 18)
  const [billing, setBilling] = useState<Billing>('annual')
  const [selectedPlanId, setSelectedPlanId] = useState<PlanId>('pro')
  const [checkoutLoadingKey, setCheckoutLoadingKey] = useState<string | null>(null)
  const [checkoutModal, setCheckoutModal] = useState<CheckoutModalState | null>(null)
  const [routerSelection, setRouterSelection] = useState<RouterSelection>(defaultRouterSelection)
  const [copied, setCopied] = useState(false)

  const routePlan = useMemo(() => analyzeRouterSelection(routerSelection), [routerSelection])

  useEffect(() => {
    const seo = buildSeoDocument({ pathname, routeView, publicAppOrigin, keywordPage })
    syncSeoDocument(seo)
    trackPageView(normalizedPath)
  }, [keywordPage, normalizedPath, pathname, publicAppOrigin, routeView])

  useEffect(() => {
    const onScroll = () => setHeaderCompact(window.scrollY > 18)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    let cancelled = false
    fetch(resolveApiUrl('/api/runtime'))
      .then((response) => (response.ok ? response.json() : null))
      .then((payload) => {
        if (!cancelled && typeof payload?.publicAppOrigin === 'string') {
          setPublicAppOrigin(payload.publicAppOrigin)
        }
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const listener = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return
      if (event.data?.type === 'nine-router-checkout-complete') {
        setCheckoutModal(null)
        trackEvent('checkout_complete_return', { path: pathname })
        navigate('/?payment=success')
      }
    }
    window.addEventListener('message', listener)
    return () => window.removeEventListener('message', listener)
  }, [navigate, pathname])

  function openPage(path: string) {
    navigate(path)
  }

  function chooseProAnnual(source: string) {
    setBilling('annual')
    setSelectedPlanId('pro')
    trackEvent('pricing_intent', { source, planId: 'pro', billing: 'annual' })
    navigate('/pricing#pricing')
  }

  function updateRouterSelection<K extends keyof RouterSelection>(key: K, value: RouterSelection[K]) {
    setRouterSelection((current) => ({ ...current, [key]: value }))
    trackEvent('route_planner_change', { key, value })
  }

  async function copyRoutePlan() {
    const text = routePlan.configLines.join('\n')
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      trackEvent('route_plan_copied', { tool: routerSelection.tool })
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  async function startHostedCheckout(planId: PlanId, nextBilling: Billing, loadingKey: string, provider = 'creem') {
    setSelectedPlanId(planId)
    setCheckoutLoadingKey(loadingKey)
    setCheckoutModal({ planId, billing: nextBilling, loadingKey, status: 'loading' })
    trackEvent('checkout_start', { planId, billing: nextBilling })

    const popup = openCenteredCheckoutWindow()

    try {
      const url = await createCheckoutSession(planId, nextBilling, provider === 'nowpayments' ? '/api/nowpayments-checkout' : '/api/checkout')
      const popupOpened = sendPopupToCheckout(popup, url)
      if (!popupOpened) {
        setCheckoutModal({ planId, billing: nextBilling, loadingKey, status: 'retry', checkoutUrl: url })
        if (popup && !popup.closed) popup.close()
        return
      }

      setCheckoutModal({ planId, billing: nextBilling, loadingKey, status: 'popup', checkoutUrl: url })
      trackEvent('checkout_popup_opened', { planId, billing: nextBilling })
    } catch (error) {
      if (popup && !popup.closed) popup.close()
      setCheckoutModal({ planId, billing: nextBilling, loadingKey, status: 'retry' })
      trackEvent('checkout_error', {
        planId,
        billing: nextBilling,
        message: error instanceof Error ? error.message : 'Unknown checkout error',
      })
    } finally {
      setCheckoutLoadingKey(null)
    }
  }

  const renderHeader = () => (
    <header className={`nr-header${headerCompact ? ' compact' : ''}`}>
      <div className="nr-header-inner">
        <a
          href="/"
          className="nr-brand"
          onClick={(event) => {
            event.preventDefault()
            navigate('/')
          }}
        >
          <span className="nr-brand-mark">
            <Route size={23} />
          </span>
          <span className="nr-brand-copy">
            <strong>9router Space</strong>
            <span>AI route control plane</span>
          </span>
        </a>

        <nav className="nr-nav" aria-label="Primary navigation">
          <a href="/9router-ai" onClick={(event) => { event.preventDefault(); openPage('/9router-ai') }}>AI routing</a>
          <a href="/9router-install" onClick={(event) => { event.preventDefault(); openPage('/9router-install') }}>Install</a>
          <a href="/9router-github" onClick={(event) => { event.preventDefault(); openPage('/9router-github') }}>GitHub</a>
          <a href="/pricing" onClick={(event) => { event.preventDefault(); openPage('/pricing') }}>Pricing</a>
        </nav>

        <button type="button" className="nr-btn nr-btn-primary nr-header-cta" onClick={() => chooseProAnnual('header')}>
          <Rocket size={17} />
          {ctaPrimary}
        </button>
      </div>
    </header>
  )

  const renderCheckoutModal = () => {
    if (!checkoutModal) return null

    const checkoutUrl = checkoutModal.status === 'popup' || checkoutModal.status === 'retry' ? checkoutModal.checkoutUrl : undefined

    return (
      <div className="nr-checkout-backdrop" role="presentation">
        <section className="nr-checkout-modal" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
          <button
            type="button"
            className="nr-checkout-close"
            aria-label="Close checkout"
            onClick={() => {
              setCheckoutModal(null)
              trackEvent('checkout_overlay_closed', { status: checkoutModal.status })
            }}
          >
            <X size={18} />
          </button>

          {checkoutModal.status === 'loading' ? (
            <div className="nr-checkout-loading" aria-live="polite">
              <span />
              Preparing secure checkout...
            </div>
          ) : checkoutUrl && checkoutModal.status === 'popup' ? (
            <div className="nr-checkout-copy">
              <p className="nr-eyebrow">Secure checkout</p>
              <h2 id="checkout-title">Creem checkout opened.</h2>
              <p>Complete payment in the centered popup. This page stays in place and returns to the homepage after success.</p>
              <div className="nr-checkout-actions">
                <a className="nr-btn nr-btn-primary" href={checkoutUrl} target="_blank" rel="noreferrer noopener">
                  Reopen checkout
                </a>
              </div>
            </div>
          ) : (
            <div className="nr-checkout-copy">
              <p className="nr-eyebrow">Checkout</p>
              <h2 id="checkout-title">Checkout could not open yet.</h2>
              <p>Allow the payment popup and try again. The original 9router Space page will stay open behind the payment window.</p>
              <div className="nr-checkout-actions">
                <button
                  type="button"
                  className="nr-btn nr-btn-primary"
                  onClick={() => void startHostedCheckout(checkoutModal.planId, checkoutModal.billing, checkoutModal.loadingKey)}
                >
                  Try checkout again
                </button>
                {checkoutUrl ? (
                  <a className="nr-btn nr-btn-ghost" href={checkoutUrl} target="_blank" rel="noreferrer noopener">
                    Open payment link
                  </a>
                ) : null}
              </div>
            </div>
          )}
        </section>
      </div>
    )
  }

  const renderOptionButtons = <K extends keyof RouterSelection>(key: K, options: Option<RouterSelection[K]>[]) => (
    <div className="nr-option-grid">
      {options.map((option) => (
        <button
          type="button"
          key={option.id}
          className="nr-option"
          data-active={routerSelection[key] === option.id ? 'true' : 'false'}
          onClick={() => updateRouterSelection(key, option.id)}
        >
          <strong>{option.label}</strong>
          <span>{option.summary}</span>
        </button>
      ))}
    </div>
  )

  const renderRouterPanel = () => (
    <aside className="nr-workspace-panel" id="planner" aria-label="9router route planner">
      <div className="nr-panel-top">
        <div>
          <p className="nr-eyebrow">Route planner</p>
          <h2>{routePlan.headline}</h2>
        </div>
        <div className="nr-score">
          <strong>{routePlan.fitScore}</strong>
          <span>{routePlan.fitLabel}</span>
        </div>
      </div>

      <div className="nr-choice-stack">
        <section>
          <div className="nr-choice-label">Coding tool</div>
          {renderOptionButtons('tool', toolOptions)}
        </section>
        <section>
          <div className="nr-choice-label">Primary spend</div>
          {renderOptionButtons('primary', primaryOptions)}
        </section>
        <section className="nr-split-options">
          <div>
            <div className="nr-choice-label">Fallback</div>
            {renderOptionButtons('fallback', fallbackOptions)}
          </div>
          <div>
            <div className="nr-choice-label">Token policy</div>
            {renderOptionButtons('tokenPolicy', tokenPolicyOptions)}
          </div>
        </section>
        <section className="nr-split-options">
          <div>
            <div className="nr-choice-label">Deployment</div>
            {renderOptionButtons('deployment', deploymentOptions)}
          </div>
          <div>
            <div className="nr-choice-label">Buyer</div>
            {renderOptionButtons('team', teamOptions)}
          </div>
        </section>
      </div>

      <div className="nr-result-grid">
        {routePlan.modules.map((module) => (
          <article key={module.label}>
            <span>{module.label}</span>
            <strong>{module.detail}</strong>
          </article>
        ))}
      </div>

      <div className="nr-config-box">
        <div className="nr-config-head">
          <div>
            <p className="nr-eyebrow">Generated route</p>
            <h3>{routePlan.runShape}</h3>
          </div>
          <button type="button" className="nr-icon-btn" onClick={() => void copyRoutePlan()} aria-label="Copy route plan">
            <Clipboard size={17} />
          </button>
        </div>
        <pre>{routePlan.configLines.join('\n')}</pre>
        {copied ? <span className="nr-copy-note">Copied</span> : null}
      </div>

      <div className="nr-next-box">
        <div>
          <p className="nr-eyebrow">Recommended next move</p>
          <h3>{routePlan.operatorMessage}</h3>
          <p>{routePlan.estimatedInputSavings} input posture with {routePlan.fitLabel.toLowerCase()} confidence.</p>
        </div>
        <button type="button" className="nr-btn nr-btn-primary" onClick={() => chooseProAnnual('planner')}>
          <Play size={18} />
          {ctaPrimary}
        </button>
      </div>
    </aside>
  )

  const renderPricingSection = (standalone = false) => (
    <section className={`nr-section nr-pricing-section${standalone ? ' standalone' : ''}`} id="pricing">
      <div className="nr-section-head nr-pricing-head">
        <div>
          <p className="nr-eyebrow">Pricing</p>
          <h2>Start lean, scale as you grow.</h2>
          <p>Every plan uses one-time checkout with no automatic renewal. Pro annual gets the 50% yearly discount.</p>
        </div>
        <div className="nr-cycle" role="group" aria-label="Billing cycle">
          <button
            type="button"
            data-active={billing === 'monthly' ? 'true' : 'false'}
            onClick={() => {
              setBilling('monthly')
              trackEvent('billing_cycle_change', { billing: 'monthly' })
            }}
          >
            Monthly
          </button>
          <button
            type="button"
            data-active={billing === 'annual' ? 'true' : 'false'}
            onClick={() => {
              setBilling('annual')
              trackEvent('billing_cycle_change', { billing: 'annual' })
            }}
          >
            Yearly - 50% off
          </button>
        </div>
      </div>

      <div className="nr-renewal-notice" role="note" aria-label="No automatic renewal">
        <CheckCircle2 size={18} />
        <div>
          <strong>No automatic renewal</strong>
          <p>After checkout, 9router Space will not automatically charge you next month or next year. Monthly and yearly purchases only cover the period you choose today.</p>
        </div>
      </div>

      <div className="nr-plan-grid">
        {plans.map((plan) => {
          const annualMultiplier = plan.annualDiscountMultiplier ?? 1
          const annualTotal = plan.monthlyUsd * 12 * annualMultiplier
          const monthly = billing === 'annual' ? annualTotal / 12 : plan.monthlyUsd
          const strike = billing === 'annual' && annualMultiplier < 1 ? plan.monthlyUsd : null
          const pricePeriod = billing === 'annual' ? '/mo for one year' : '/month'
          const billingNote =
            billing === 'annual'
              ? `${formatMoney(annualTotal)} due today for one year. No automatic charge next year.`
              : `${formatMoney(plan.monthlyUsd)} due today for one month. No automatic charge next month.`
          const loadingKey = `plan-${plan.id}-${billing}`
          const active = selectedPlanId === plan.id

          return (
            <article className="nr-plan-card" data-popular={plan.popular ? 'true' : 'false'} data-active={active ? 'true' : 'false'} key={plan.id}>
              {plan.popular ? <span className="nr-plan-badge">Default choice</span> : null}
              <h3>{plan.name}</h3>
              <p>{plan.tagline}</p>
              <div className="nr-price-line">
                {formatMoney(monthly)}
                <small>{pricePeriod}</small>
                {strike ? <span>{formatMoney(strike)}</span> : null}
              </div>
              <strong className="nr-billing-note">{billingNote}</strong>
              <ul>
                {plan.bullets.map((bullet) => (
                  <li data-included={bullet.included === false ? 'false' : 'true'} key={bullet.label}>
                    {bullet.included === false ? <span className="nr-feature-dash">-</span> : <Check size={15} />}
                    {bullet.label}
                  </li>
                ))}
              </ul>
              <div className="nr-plan-actions">
                <button
                  type="button"
                  className={plan.popular ? 'nr-btn nr-btn-primary' : 'nr-btn nr-btn-ghost'}
                  onClick={() => void startHostedCheckout(plan.id, billing, loadingKey)}
                  onMouseEnter={() => setSelectedPlanId(plan.id)}
                  disabled={checkoutLoadingKey !== null}
                >
                  {checkoutLoadingKey === loadingKey ? 'Opening secure checkout...' : plan.id === 'pro' ? ctaCheckout : `Continue with ${plan.shortName}`}
                </button>
                <button
                  type="button"
                  className="nr-btn nr-btn-ghost"
                  onClick={() => void startHostedCheckout(plan.id, billing, `${loadingKey}-wallet`, 'nowpayments')}
                  disabled={checkoutLoadingKey !== null}
                >
                  {checkoutLoadingKey === `${loadingKey}-wallet` ? 'Opening USDC wallet...' : 'Pay with USDC Wallet'}
                </button>
                {active ? <span className="nr-plan-selected">Selected</span> : null}
              </div>
            </article>
          )
        })}
      </div>

      {standalone ? (
        <div className="nr-faq-grid">
          <article>
            <h3>Why is Pro selected first?</h3>
            <p>Starter is useful for one operator, but Pro fits the serious evaluation because it includes Docker review, fallback policy, provider controls, and priority onboarding.</p>
          </article>
          <article>
            <h3>Why annual by default?</h3>
            <p>Router adoption usually spans more than one billing cycle. Pro annual cuts the Pro monthly run-rate by 50%.</p>
          </article>
          <article>
            <h3>Does payment replace this page?</h3>
            <p>No. Checkout opens in a centered Creem popup and the product page stays visible behind a blurred overlay.</p>
          </article>
        </div>
      ) : null}
    </section>
  )

  const renderHome = () => {
    const paymentSuccess = new URLSearchParams(search).get('payment') === 'success'

    return (
      <main className="nr-main">
        {paymentSuccess ? (
          <section className="nr-success-banner">
            <CheckCircle2 size={18} />
            Payment received. 9router Space onboarding will continue from the email used at checkout.
          </section>
        ) : null}

        <section className="nr-hero">
          <div className="nr-hero-copy">
            <p className="nr-eyebrow">9router managed rollout</p>
            <h1>Run 9router as the control plane for every AI coding tool.</h1>
            <p className="nr-lede">
              9router Space helps teams turn the open-source 9router gateway into a reliable route plan for Codex, Cursor, Antigravity, Claude Code, Docker, npm installs, fallback models, and token savings.
            </p>

            <div className="nr-hero-actions">
              <button type="button" className="nr-btn nr-btn-primary" onClick={() => chooseProAnnual('hero')}>
                <Rocket size={18} />
                {ctaPrimary}
              </button>
              <button
                type="button"
                className="nr-btn nr-btn-ghost"
                onClick={() => {
                  trackEvent('pricing_review', { source: 'hero-secondary' })
                  navigate('/pricing#pricing')
                }}
              >
                <Layers3 size={18} />
                Review plans
              </button>
              <button type="button" className="nr-btn nr-btn-subtle" onClick={() => openPage('/9router-install')}>
                <TerminalSquare size={18} />
                Install guide
              </button>
            </div>
            <p className="nr-payment-note">
              <CheckCircle2 size={16} />
              <span>Pro annual selected. Pro yearly saves 50%. Hosted SaaS: pay here, then use the managed workspace; no self-hosting needed.</span>
            </p>

            <div className="nr-trust-row">
              {trustLinks.map((link) =>
                link.internal ? (
                  <a
                    href={link.href}
                    key={link.href}
                    onClick={(event) => {
                      event.preventDefault()
                      openPage(link.href)
                    }}
                  >
                    {link.icon}
                    {link.label}
                    <ChevronRight size={13} />
                  </a>
                ) : (
                  <a href={link.href} key={link.href} target="_blank" rel="noreferrer">
                    {link.icon}
                    {link.label}
                    <ExternalLink size={13} />
                  </a>
                ),
              )}
            </div>

            <div className="nr-hero-proof">
              <div>
                <span>Default path</span>
                <strong>Route planner to Pro annual to Creem popup to homepage return</strong>
              </div>
              <div>
                <span>Best-fit work</span>
                <strong>Provider fallback, Docker persistence, Codex setup, Cursor routing, Antigravity readiness, and token policy review</strong>
              </div>
            </div>
          </div>

          {renderRouterPanel()}
        </section>

        <section className="nr-proof-strip" aria-label="9router proof points">
          {proofItems.map((item) => (
            <article key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <p>{item.detail}</p>
            </article>
          ))}
        </section>

        <section className="nr-section nr-media-section">
          <div className="nr-section-head">
            <p className="nr-eyebrow">Product signal</p>
            <h2>The route decision should be visible before the payment decision.</h2>
            <p>9router's value is easier to trust when buyers can see endpoint, provider stack, token policy, persistence, and fallback logic in the first screen.</p>
          </div>
          <div className="nr-media-grid">
            <figure className="nr-dashboard-shot">
              <img src="/9router-dashboard.png" alt="9router dashboard preview with providers and routing controls" />
              <figcaption>Reference dashboard preview from the open-source 9router project.</figcaption>
            </figure>
            <div className="nr-signal-list">
              <article>
                <PackageCheck size={20} />
                <h3>npm or Docker, same buying logic</h3>
                <p>Start fast with npm, stabilize with Docker, and buy once the route policy is clear.</p>
              </article>
              <article>
                <Cloud size={20} />
                <h3>Cloud only after guardrails</h3>
                <p>Remote endpoints need auth, TLS, API keys, logs, provider ownership, and budget boundaries.</p>
              </article>
              <article>
                <LockKeyhole size={20} />
                <h3>Secrets stay out of the page</h3>
                <p>The planner never asks for provider keys or repository data before checkout.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="nr-section">
          <div className="nr-section-head">
            <p className="nr-eyebrow">Operating model</p>
            <h2>9router becomes a SaaS decision when reliability, cost, and credential policy meet.</h2>
            <p>Every plan starts from the same question: which model should handle the next coding request when the first route fails or becomes too expensive?</p>
          </div>

          <div className="nr-card-grid">
            {workflowCards.map((card) => (
              <article className="nr-card" key={card.title}>
                <div className="nr-card-icon">{card.icon}</div>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </article>
            ))}
          </div>
        </section>

        {renderPricingSection(false)}

        <section className="nr-section">
          <div className="nr-section-head">
            <p className="nr-eyebrow">Operator notes</p>
            <h2>Reference pages for the decisions that usually come before a 9router purchase.</h2>
            <p>Each page answers a different operational intent, from GitHub inspection to Docker persistence and tool-specific routing.</p>
          </div>
          <div className="nr-guide-grid">
            {[
              ...keywordPages,
              {
                path: '/pricing',
                eyebrow: 'Pricing',
                h1: '9router Space pricing',
                intent: 'Choose Starter, Pro, or Enterprise with Pro annual already selected.',
              },
            ].map((page) => (
              <a
                className="nr-guide-card"
                href={page.path}
                key={page.path}
                onClick={(event) => {
                  event.preventDefault()
                  openPage(page.path)
                }}
              >
                <span>{page.eyebrow}</span>
                <strong>{page.h1}</strong>
                <p>{page.intent}</p>
                <ChevronRight size={18} />
              </a>
            ))}
          </div>
        </section>
      </main>
    )
  }

  const renderKeywordPage = (page: KeywordPage) => (
    <main className="nr-main">
      <article className="nr-article">
        <a
          className="nr-back-link"
          href="/"
          onClick={(event) => {
            event.preventDefault()
            navigate('/')
          }}
        >
          <ArrowRight size={16} />
          Back to 9router Space
        </a>
        <p className="nr-eyebrow">{page.eyebrow}</p>
        <h1>{page.h1}</h1>
        <p className="nr-lede">{page.lede}</p>
        <div className="nr-article-intent">
          <strong>Best for</strong>
          <span>{page.intent}</span>
        </div>

        {page.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {section.bullets ? (
              <ul>
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}

        <section>
          <h2>Common questions</h2>
          <div className="nr-faq-list">
            {page.faqs.map((faq) => (
              <article key={faq.question}>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <aside className="nr-article-cta">
          <div>
            <p className="nr-eyebrow">Recommended next step</p>
            <h2>Use the route planner, then keep Pro annual selected if the setup fits.</h2>
            <p>Checkout stays in a centered Creem popup, with Pro annual selected by default.</p>
          </div>
          <div className="nr-article-cta-actions">
            <button type="button" className="nr-btn nr-btn-primary" onClick={() => chooseProAnnual(`article-${page.path}`)}>
              <Play size={18} />
              {page.ctaLabel}
            </button>
            <button type="button" className="nr-btn nr-btn-ghost" onClick={() => navigate('/#planner')}>
              <Zap size={18} />
              Open planner
            </button>
          </div>
        </aside>
      </article>
    </main>
  )

  const renderPricingPage = () => (
    <main className="nr-main">
      <section className="nr-pricing-page-hero">
        <p className="nr-eyebrow">Pricing</p>
        <h1>9router Space pricing follows the Starter, Pro, and Enterprise path.</h1>
        <p className="nr-lede">
          Starter is for one bounded install. Pro is the default for regular 9router rollout work. Enterprise is for secured endpoints, provider governance, and heavier deployment support.
        </p>
      </section>
      {renderPricingSection(true)}
    </main>
  )

  const renderLegalPage = (title: string, intro: string, sections: typeof legalPrivacySections) => (
    <main className="nr-main">
      <article className="nr-article">
        <p className="nr-eyebrow">Legal</p>
        <h1>{title}</h1>
        <p className="nr-lede">{intro}</p>
        {sections.map((section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}
      </article>
    </main>
  )

  const renderNotFound = () => (
    <main className="nr-main">
      <section className="nr-center-panel">
        <p className="nr-eyebrow">404</p>
        <h1>Page not found</h1>
        <p className="nr-muted">That route is not available.</p>
        <button type="button" className="nr-btn nr-btn-primary" onClick={() => navigate('/')}>
          Return home
        </button>
      </section>
    </main>
  )

  let body: React.ReactNode
  if (routeView === 'home' && normalizedPath === '/') {
    body = renderHome()
  } else if (routeView === 'keyword' && keywordPage) {
    body = renderKeywordPage(keywordPage)
  } else if (routeView === 'pricing') {
    body = renderPricingPage()
  } else if (routeView === 'privacy') {
    body = renderLegalPage(
      'Privacy Policy',
      'This policy covers how 9router Space handles analytics, checkout, and related user interactions.',
      legalPrivacySections,
    )
  } else if (routeView === 'terms') {
    body = renderLegalPage(
      'Terms of Service',
      'These terms describe the limits and responsibilities of the 9router Space site and its hosted payment flow.',
      legalTermsSections,
    )
  } else if (routeView === 'checkout-done') {
    body = <CheckoutDoneBridge publicAppOrigin={publicAppOrigin} />
  } else {
    body = renderNotFound()
  }

  return (
    <div className="nr-shell">
      <div className="nr-page-texture" aria-hidden />
      {renderHeader()}
      {body}
      {renderCheckoutModal()}
      <footer className="nr-footer">
        <div className="nr-footer-inner">
          <span>9router Space</span>
          <a
            href="/privacy"
            onClick={(event) => {
              event.preventDefault()
              navigate('/privacy')
            }}
          >
            Privacy
          </a>
          <a
            href="/terms"
            onClick={(event) => {
              event.preventDefault()
              navigate('/terms')
            }}
          >
            Terms
          </a>
          <a href="https://github.com/clauxel/my-9router" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="https://github.com/decolua/9router" target="_blank" rel="noreferrer">
            Reference
          </a>
          <a href="mailto:support@aigeamy.com">support@aigeamy.com</a>
        </div>
      </footer>
    </div>
  )
}
