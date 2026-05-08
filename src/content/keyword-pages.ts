export type KeywordSection = {
  heading: string
  paragraphs: string[]
  bullets?: string[]
}

export type KeywordFaq = {
  question: string
  answer: string
}

export type KeywordPage = {
  path: string
  eyebrow: string
  title: string
  description: string
  h1: string
  lede: string
  intent: string
  ctaLabel: string
  sections: KeywordSection[]
  faqs: KeywordFaq[]
}

export const keywordPages: KeywordPage[] = [
  {
    path: '/9router-github',
    eyebrow: 'GitHub guide',
    title: '9router GitHub Workflow Guide',
    description:
      'A practical guide to the decolua/9router GitHub project, architecture signals, safer evaluation, and when a managed 9router rollout is worth it.',
    h1: 'Use the 9router GitHub project as the technical source of truth',
    lede:
      'The public 9router repository shows the real product shape: a local AI routing gateway, dashboard, OpenAI-compatible endpoint, provider translation, token savings, quota tracking, and fallback across coding tools.',
    intent: 'For technical buyers who want to inspect source before choosing a managed rollout plan.',
    ctaLabel: 'Plan Pro annual',
    sections: [
      {
        heading: 'What to inspect first',
        paragraphs: [
          'Start with the README, Docker notes, architecture document, provider constants, and the OpenAI-compatible API routes. Those files reveal how requests enter 9router, how provider credentials are selected, and where fallback decisions are made.',
          'A serious evaluation should check the pieces that affect reliability: token refresh, account cooldown, combo model fallback, persistent data, request logging, and dashboard authentication.',
        ],
        bullets: [
          'The upstream project is decolua/9router on GitHub.',
          'Core compatibility routes live under the Next.js API surface.',
          'Routing, streaming, provider execution, and translation are handled by shared SSE modules.',
          'Local state is stored in a JSON database under the configured data directory.',
        ],
      },
      {
        heading: 'How the managed site helps',
        paragraphs: [
          'GitHub answers whether the tool is technically plausible. A buying page should answer whether your first rollout is scoped, safe, and valuable enough to fund.',
          '9router Space turns that decision into a route plan: target tool, provider stack, token policy, deployment posture, and checkout path. The public source stays visible, while the purchase flow stays focused.',
        ],
      },
      {
        heading: 'Trust model for teams',
        paragraphs: [
          'Provider keys, OAuth tokens, request logs, and local databases are sensitive. Before a team routes real coding traffic, define who can access the dashboard, where data is stored, and how credentials are rotated.',
          'The middle Pro annual plan is selected by default because most teams need rollout help, fallback policy, and provider review before they need a custom enterprise setup.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is this the official 9router repository?',
        answer:
          'The technical reference is github.com/decolua/9router. This site is an independent managed rollout and checkout site built around practical 9router adoption.',
      },
      {
        question: 'Should I read GitHub before paying?',
        answer:
          'Yes. Inspect the upstream source, understand where credentials and logs live, then use this site to choose a rollout plan.',
      },
      {
        question: 'Which plan fits a GitHub-first evaluation?',
        answer:
          'Pro annual is the default because it includes enough setup and provider-policy support for a real team evaluation.',
      },
    ],
  },
  {
    path: '/9router-docker',
    eyebrow: 'Docker guide',
    title: '9router Docker Setup',
    description:
      'Run 9router with Docker, persistent storage, port 20128, safer environment variables, restart checks, and team rollout notes.',
    h1: 'Run 9router in Docker with a persistent routing state',
    lede:
      'Docker is the cleanest first production-like shape for 9router: the dashboard listens on port 20128, provider settings persist in a mounted data directory, and restarts are easier to reason about.',
    intent: 'For operators who want repeatable 9router installs without losing provider settings after a restart.',
    ctaLabel: 'Choose Pro annual',
    sections: [
      {
        heading: 'Baseline container command',
        paragraphs: [
          'A useful Docker run mounts the 9router data directory and sets DATA_DIR inside the container. That keeps db.json and routing configuration outside the image.',
          'Expose only the port you need, and treat the dashboard as private unless you have authentication, TLS, API keys, and network boundaries in place.',
        ],
        bullets: [
          'Build from source with docker build -t 9router .',
          'Run with -p 20128:20128 so CLI tools can use the /v1 endpoint.',
          'Mount $HOME/.9router to /app/data and set DATA_DIR=/app/data.',
          'Use docker logs and restart checks after provider changes.',
        ],
      },
      {
        heading: 'What to persist',
        paragraphs: [
          'The important state is not the image. It is provider connections, combos, model aliases, API keys, dashboard settings, usage history, and request logs.',
          'Back up the data directory before upgrades. Avoid storing the directory in a public repo, issue, screenshot, or shared support thread because it can contain sensitive provider metadata.',
        ],
      },
      {
        heading: 'When Docker is not enough',
        paragraphs: [
          'Docker is a strong one-machine deployment. Teams with multiple operators may also need a documented provider policy, secured network entry, and a reliable checkout/onboarding process.',
          'That is why the managed Pro path focuses on rollout readiness rather than pretending installation alone solves adoption.',
        ],
      },
    ],
    faqs: [
      {
        question: 'What port does 9router use?',
        answer:
          'The common examples use port 20128, with clients pointing to http://localhost:20128/v1 for OpenAI-compatible requests.',
      },
      {
        question: 'Can I expose 9router directly to the internet?',
        answer:
          'Only with proper authentication, TLS, API key enforcement, network restrictions, and secret handling. A local or private network route is safer for most teams.',
      },
      {
        question: 'Why is Pro selected for Docker users?',
        answer:
          'Docker users are usually past curiosity and closer to team evaluation, where rollout help and policy review matter.',
      },
    ],
  },
  {
    path: '/9router-npm',
    eyebrow: 'NPM guide',
    title: '9router NPM Install and Upgrade Guide',
    description:
      'Use the 9router npm package for quick installs, version checks, local startup, and safer upgrade review before routing production coding traffic.',
    h1: 'Use npm when you want the fastest 9router trial',
    lede:
      'The npm package gives individual developers the quickest way to start 9router locally. It is best for first contact, CLI experiments, and verifying that your coding tool can speak to the OpenAI-compatible endpoint.',
    intent: 'For developers who want to install 9router quickly and understand what to check before using it for real work.',
    ctaLabel: 'Compare rollout plans',
    sections: [
      {
        heading: 'Quick npm path',
        paragraphs: [
          'The common install path is npm install -g 9router, then running 9router to open the local dashboard. Before relying on it, check the current package version and read the upstream changelog.',
          'On May 8, 2026, npm reported 9router version 0.4.20 as latest. Treat that as a build-time reference and verify npm before any future upgrade.',
        ],
        bullets: [
          'Run npm view 9router version before upgrades.',
          'Start locally, then point your client to http://localhost:20128/v1.',
          'Keep provider keys out of shell history and public logs.',
          'Use Docker or a controlled service wrapper for longer-running use.',
        ],
      },
      {
        heading: 'When npm is enough',
        paragraphs: [
          'Npm is enough when one developer wants to test Codex, Claude Code, Cursor, Cline, or another client against a local 9router endpoint.',
          'It is not enough by itself when multiple people need a shared policy, budget visibility, fallback rules, or an onboarding path after payment.',
        ],
      },
      {
        heading: 'Upgrade posture',
        paragraphs: [
          'Before upgrading, read release notes for provider changes, token refresh behavior, fallback changes, logging behavior, and dashboard auth updates.',
          'If a coding team depends on 9router during active work, test upgrades with a copy of the data directory rather than making a blind change mid-session.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is npm the same as Docker?',
        answer:
          'No. Npm is the quickest local install. Docker gives a more repeatable runtime and clearer persistence boundary.',
      },
      {
        question: 'What endpoint should npm users configure?',
        answer:
          'Use http://localhost:20128/v1 for OpenAI-compatible clients unless you have changed the host or port.',
      },
      {
        question: 'Should teams buy after an npm trial?',
        answer:
          'If the trial proves value, Pro annual gives a cleaner path for rollout planning, provider policy, and payment-supported onboarding.',
      },
    ],
  },
  {
    path: '/9router-install',
    eyebrow: 'Install guide',
    title: '9router Install Guide',
    description:
      'Install 9router with npm, source, Docker, or cloud-ready patterns, then connect coding tools to a stable /v1 AI routing endpoint.',
    h1: 'Install 9router only after choosing the route you actually need',
    lede:
      'A good 9router install is not just a command. It is a decision about where credentials live, which coding tool connects first, what fallback models are allowed, and how much token compression you want.',
    intent: 'For buyers and operators who want a practical install path without hiding operational tradeoffs.',
    ctaLabel: 'Start Pro annual',
    sections: [
      {
        heading: 'Choose the install shape',
        paragraphs: [
          'Use npm for a fast local trial. Use source when you want to inspect or modify the app. Use Docker when you need repeatable persistence. Use a secured cloud endpoint only after auth, TLS, and secret rules are clear.',
          'The first-screen planner on this site mirrors that decision because installation and conversion should not be separate worlds.',
        ],
        bullets: [
          'Local trial: npm install -g 9router && 9router.',
          'Source: clone the repository, install dependencies, set PORT=20128, then run the app.',
          'Docker: mount a persistent data directory and expose port 20128.',
          'Team endpoint: define API keys, dashboard auth, logging policy, and provider ownership first.',
        ],
      },
      {
        heading: 'Connect one tool first',
        paragraphs: [
          'Do not connect every client on day one. Start with Codex, Cursor, Antigravity, or Claude Code, confirm the /v1 endpoint works, then add fallback routes.',
          'A controlled first client makes debugging easier and prevents scattered credentials before the team understands the router.',
        ],
      },
      {
        heading: 'What success looks like',
        paragraphs: [
          'A successful install has a visible dashboard, a working /v1 models or chat endpoint, one validated provider, a configured API key for the client, and a fallback path that does not surprise the team.',
          'Once that is true, the paid Pro path makes sense because the work shifts from installation to operation.',
        ],
      },
    ],
    faqs: [
      {
        question: 'What is the safest first install?',
        answer:
          'For most users, a local npm trial or Docker container on a private machine is safer than exposing a remote router immediately.',
      },
      {
        question: 'Do I need every provider before starting?',
        answer:
          'No. Start with one provider and one client. Add cheap and free backups once the baseline path works.',
      },
      {
        question: 'Why does the site ask about deployment before checkout?',
        answer:
          'Deployment shape determines the support and policy work you actually need. That is why Pro annual is selected for serious team setups.',
      },
    ],
  },
  {
    path: '/9router-ai',
    eyebrow: 'AI routing',
    title: '9router AI Routing for Coding Teams',
    description:
      'Understand how 9router AI routing handles providers, token saving, quota tracking, OpenAI-compatible endpoints, and fallback for coding tools.',
    h1: '9router turns AI coding traffic into a managed route stack',
    lede:
      'AI coding tools become easier to operate when they point to one routing layer. 9router gives that layer a dashboard, provider connections, model combos, fallback, token-saving filters, and usage visibility.',
    intent: 'For teams comparing a single AI provider against a router that can manage cost, quota, and uptime.',
    ctaLabel: 'Choose Pro annual',
    sections: [
      {
        heading: 'Why route AI traffic',
        paragraphs: [
          'A single model is easy until it hits rate limits, burns through a quota, or becomes too expensive for routine tool output. A router lets the team decide which work deserves premium models and which work can fall back.',
          '9router is especially relevant for coding because command output, diffs, logs, and search results can consume large amounts of input context.',
        ],
        bullets: [
          'OpenAI-compatible endpoint for many clients.',
          'Provider translation across different model APIs.',
          'Combo fallback from premium to cheap to free lanes.',
          'RTK compression for noisy tool_result content.',
        ],
      },
      {
        heading: 'Cost and continuity',
        paragraphs: [
          'The value is not only lower spend. It is fewer broken coding sessions. When quota runs out, a fallback stack can keep work moving while making the tradeoff visible.',
          'The managed site turns that into a purchase decision: pick a route, confirm the default Pro annual plan, and open Creem checkout without losing the page context.',
        ],
      },
      {
        heading: 'Operational caution',
        paragraphs: [
          'Routing AI traffic also concentrates sensitive configuration. Treat dashboard credentials, provider tokens, request logs, and local databases as private operational assets.',
          'Do not run the router as an unprotected public proxy. The best setup is the one your team can operate safely after the excitement of the first demo fades.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Does 9router replace AI models?',
        answer:
          'No. It routes requests to upstream providers and helps manage translation, fallback, quota, usage, and token policy.',
      },
      {
        question: 'Where does token saving happen?',
        answer:
          'RTK-style compression targets noisy tool output before it is sent upstream, preserving useful context while reducing unnecessary token load.',
      },
      {
        question: 'Why pay for a managed rollout if 9router is open source?',
        answer:
          'The software is open. The paid value is rollout planning, policy, onboarding, and a focused purchase path for teams that want help operating it.',
      },
    ],
  },
  {
    path: '/9router-codex',
    eyebrow: 'Codex setup',
    title: '9router Codex Setup',
    description:
      'Connect Codex to 9router with an OpenAI-compatible base URL, route model stacks, token-saving policy, and safer fallback for terminal coding sessions.',
    h1: 'Point Codex at 9router when coding sessions need fallback',
    lede:
      'Codex-style terminal work can generate large tool outputs and long sessions. 9router gives Codex a stable OpenAI-compatible endpoint plus a route stack that can move from premium quota to lower-cost continuity.',
    intent: 'For Codex users who want fewer interrupted sessions and clearer model-routing control.',
    ctaLabel: 'Checkout Pro annual',
    sections: [
      {
        heading: 'Basic Codex shape',
        paragraphs: [
          'The typical setup is to run 9router locally, copy the generated API key from the dashboard, then point Codex to the 9router /v1 endpoint.',
          'A practical model route starts with your preferred Codex or subscription-backed model, then falls back to a cheap provider, then a free continuity lane if the session can tolerate it.',
        ],
        bullets: [
          'Set OPENAI_BASE_URL to http://localhost:20128/v1.',
          'Set OPENAI_API_KEY to the dashboard key, not an upstream provider key.',
          'Use a named combo for the route rather than editing every session manually.',
          'Keep RTK enabled when Codex uses shell-heavy workflows.',
        ],
      },
      {
        heading: 'Why Codex benefits from RTK',
        paragraphs: [
          'Repository work often sends diffs, grep matches, logs, and directory listings back into the model. Those are exactly the inputs that can become expensive or push a context window toward the edge.',
          'RTK-style filters help reduce that load while keeping the operational meaning of the tool result available.',
        ],
      },
      {
        heading: 'Buying path',
        paragraphs: [
          'Codex users usually know whether the first route is useful within minutes. The pricing page keeps annual billing selected and defaults to Pro because a real team setup needs more than a one-off local test.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Does Codex need a special 9router API?',
        answer:
          'No. Use the OpenAI-compatible /v1 endpoint and the API key generated by the 9router dashboard.',
      },
      {
        question: 'Can Codex use free fallback models?',
        answer:
          'Yes, if the route is configured and the task can tolerate the quality and availability tradeoff.',
      },
      {
        question: 'Why is annual billing selected?',
        answer:
          'Router adoption usually lasts longer than one month. Annual billing is selected by default and is 50% cheaper than the monthly run-rate.',
      },
    ],
  },
  {
    path: '/9router-antigravity',
    eyebrow: 'Antigravity setup',
    title: '9router Antigravity Routing Guide',
    description:
      'Plan a 9router setup for Antigravity-style AI coding, provider fallback, quota visibility, token saving, and safer team operations.',
    h1: 'Use 9router to make Antigravity routing more predictable',
    lede:
      'Antigravity-style IDE traffic is valuable when it stays reliable. 9router can help by translating formats, tracking provider availability, and moving traffic through a planned fallback stack.',
    intent: 'For Antigravity users who need practical routing and operational guardrails before paying for a rollout.',
    ctaLabel: 'Plan Pro annual',
    sections: [
      {
        heading: 'What to decide first',
        paragraphs: [
          'Before connecting an IDE, decide which provider should be primary, what counts as an acceptable fallback, and whether the team wants strict logs or token-saving compression.',
          'Do not expose a router endpoint broadly until API keys, TLS, dashboard auth, and log retention are clear.',
        ],
        bullets: [
          'Primary route for best coding quality.',
          'Cheap backup for rate-limit or quota events.',
          'Free lane for continuity when the task is low risk.',
          'RTK saver for tool-heavy prompts.',
        ],
      },
      {
        heading: 'Antigravity-specific caution',
        paragraphs: [
          'IDE routing can involve extra integration details. Keep the first setup small, verify one model route, and only then add more providers or shared team access.',
          'If the route fails, the team should know whether it is an IDE setting, 9router endpoint, provider auth, quota limit, or model translation issue.',
        ],
      },
      {
        heading: 'Why Pro is the default',
        paragraphs: [
          'A single-user Antigravity test can start small. A team rollout needs provider policy, installation notes, and checkout-supported onboarding, which is why Pro annual is selected by default.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is Antigravity support the same as Codex support?',
        answer:
          'No. The operational goal is similar, but IDE traffic can have different setup details. Verify the current 9router upstream docs before relying on it.',
      },
      {
        question: 'Should I use a cloud endpoint for Antigravity?',
        answer:
          'Only if you can secure it. Local or private network routing is easier to control for the first rollout.',
      },
      {
        question: 'What should I test before checkout?',
        answer:
          'Confirm that one Antigravity route reaches 9router, uses the intended model stack, and fails over in a way the team understands.',
      },
    ],
  },
  {
    path: '/9router-cursor',
    eyebrow: 'Cursor setup',
    title: '9router Cursor Routing Guide',
    description:
      'Connect Cursor workflows to 9router-style routing decisions, model stacks, fallback, cloud endpoint caution, and Pro annual rollout planning.',
    h1: 'Cursor teams use 9router when model choice needs a control layer',
    lede:
      'Cursor is strongest when the editor stays fast and the model route is clear. 9router can help teams reason about provider choice, fallback, quota, token policy, and a single endpoint strategy.',
    intent: 'For Cursor users comparing direct provider keys against a managed 9router route stack.',
    ctaLabel: 'Compare Pro annual',
    sections: [
      {
        heading: 'Cursor routing decisions',
        paragraphs: [
          'Cursor setups vary by account and feature path, so verify the current upstream 9router guidance before changing production editor settings.',
          'The durable decision is the same: keep provider secrets controlled, choose a primary model, define fallback, and make the endpoint behavior obvious to the people using it.',
        ],
        bullets: [
          'Confirm whether the client can use a local endpoint or needs a cloud/tunnel path.',
          'Avoid scattering upstream provider keys across individual machines.',
          'Use combos so model fallback is visible and repeatable.',
          'Track usage before deciding whether a team-wide route is justified.',
        ],
      },
      {
        heading: 'When a managed plan helps',
        paragraphs: [
          'A Cursor team often needs more than a command. It needs a policy for who owns the route, how provider quotas are spent, and what happens when the primary model fails.',
          'The Pro plan is designed around that middle zone: more serious than a solo experiment, lighter than a custom operations engagement.',
        ],
      },
      {
        heading: 'Checkout behavior',
        paragraphs: [
          'The pricing page keeps annual billing on and Pro selected. Creem opens in a centered popup, while the current page remains blurred in the background so the buyer keeps plan context.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Can Cursor use 9router directly?',
        answer:
          'It depends on the current Cursor path and 9router support. Use the upstream docs for exact setup and this site for rollout planning.',
      },
      {
        question: 'Why would Cursor users need fallback?',
        answer:
          'Editor sessions can be interrupted by quota, rate limits, provider outages, or cost controls. A route stack keeps those decisions explicit.',
      },
      {
        question: 'Is the Pro plan mandatory?',
        answer:
          'No. Starter can validate one workflow, but Pro annual is the default recommendation for team Cursor routing.',
      },
    ],
  },
]

export function findKeywordPageByPath(pathname: string) {
  const normalized = pathname.replace(/\/+$/, '') || '/'
  return keywordPages.find((page) => page.path === normalized) ?? null
}
