export type PlanId = 'starter' | 'pro' | 'ops'

export type Option<T extends string = string> = {
  id: T
  label: string
  summary: string
}

export type RouterSelection = {
  tool: 'codex' | 'cursor' | 'antigravity' | 'claude'
  primary: 'subscription' | 'cheap' | 'free'
  fallback: 'two' | 'three'
  tokenPolicy: 'rtk' | 'strict'
  deployment: 'local' | 'docker' | 'cloud'
  team: 'solo' | 'team'
}

export type RouterResult = {
  fitScore: number
  fitLabel: string
  recommendedPlanId: PlanId
  headline: string
  endpoint: string
  modelStack: string[]
  estimatedInputSavings: string
  runShape: string
  reasons: string[]
  watchouts: string[]
  modules: Array<{ label: string; detail: string }>
  configLines: string[]
  operatorMessage: string
}

export const toolOptions: Option<RouterSelection['tool']>[] = [
  { id: 'codex', label: 'Codex', summary: 'OpenAI-compatible endpoint for terminal coding work.' },
  { id: 'cursor', label: 'Cursor', summary: 'Route editor sessions through managed model stacks.' },
  { id: 'antigravity', label: 'Antigravity', summary: 'Stabilize IDE traffic with provider fallback.' },
  { id: 'claude', label: 'Claude Code', summary: 'Use Claude-style coding with quota and backup visibility.' },
]

export const primaryOptions: Option<RouterSelection['primary']>[] = [
  { id: 'subscription', label: 'Use subscriptions', summary: 'Spend existing Claude, Codex, Cursor, or Copilot quota first.' },
  { id: 'cheap', label: 'Cheap primary', summary: 'Start with GLM, MiniMax, Kimi, or compatible API providers.' },
  { id: 'free', label: 'Free first', summary: 'Start with Kiro, OpenCode Free, or trial-credit providers.' },
]

export const fallbackOptions: Option<RouterSelection['fallback']>[] = [
  { id: 'two', label: '2-step fallback', summary: 'Primary provider, then one backup lane.' },
  { id: 'three', label: '3-tier fallback', summary: 'Subscription, cheap backup, then free continuity.' },
]

export const tokenPolicyOptions: Option<RouterSelection['tokenPolicy']>[] = [
  { id: 'rtk', label: 'RTK saver', summary: 'Compress tool output before it reaches the model.' },
  { id: 'strict', label: 'Strict logs', summary: 'Preserve more request detail for audit-heavy teams.' },
]

export const deploymentOptions: Option<RouterSelection['deployment']>[] = [
  { id: 'local', label: 'Localhost', summary: 'Fastest install for one machine on port 20128.' },
  { id: 'docker', label: 'Docker', summary: 'Persistent volume, stable restart, easier updates.' },
  { id: 'cloud', label: 'Cloud edge', summary: 'Use a managed endpoint pattern for distributed teams.' },
]

export const teamOptions: Option<RouterSelection['team']>[] = [
  { id: 'solo', label: 'Solo operator', summary: 'One person controlling credentials and usage.' },
  { id: 'team', label: 'Team desk', summary: 'Shared rollout, budget policy, and provider review.' },
]

export const defaultRouterSelection: RouterSelection = {
  tool: 'codex',
  primary: 'subscription',
  fallback: 'three',
  tokenPolicy: 'rtk',
  deployment: 'docker',
  team: 'team',
}

const toolConfig: Record<RouterSelection['tool'], { label: string; endpoint: string; defaultModel: string }> = {
  codex: {
    label: 'Codex',
    endpoint: 'OPENAI_BASE_URL=http://localhost:20128/v1',
    defaultModel: 'cx/gpt-5.5 -> glm/glm-5.1 -> kr/claude-sonnet-4.5',
  },
  cursor: {
    label: 'Cursor',
    endpoint: 'OpenAI API Base URL: http://localhost:20128/v1',
    defaultModel: 'cu/claude-4.6-opus-max -> glm/glm-5.1 -> oc/free',
  },
  antigravity: {
    label: 'Antigravity',
    endpoint: '9router endpoint: http://localhost:20128/v1',
    defaultModel: 'ag/gemini-3-pro -> glm/glm-5.1 -> kr/claude-sonnet-4.5',
  },
  claude: {
    label: 'Claude Code',
    endpoint: 'ANTHROPIC_BASE_URL=http://localhost:20128/v1',
    defaultModel: 'cc/claude-opus-4-7 -> glm/glm-5.1 -> kr/claude-sonnet-4.5',
  },
}

export function analyzeRouterSelection(selection: RouterSelection): RouterResult {
  let score = 70
  const reasons: string[] = []
  const watchouts: string[] = []

  if (selection.fallback === 'three') {
    score += 10
    reasons.push('A three-tier route keeps coding sessions alive when subscription or cheap providers hit quota.')
  } else {
    score += 4
    watchouts.push('Two-step fallback is simpler, but it leaves less room when long coding sessions spike.')
  }

  if (selection.tokenPolicy === 'rtk') {
    score += 9
    reasons.push('RTK compression is a strong default for tool-heavy prompts such as git diff, grep, logs, and tree output.')
  } else {
    score += 2
    watchouts.push('Strict logs are useful for audits, but they can raise token spend on noisy tool output.')
  }

  if (selection.deployment === 'docker') {
    score += 7
    reasons.push('Docker gives 9router a persistent data volume and repeatable restart path.')
  } else if (selection.deployment === 'cloud') {
    score += 5
    reasons.push('A cloud endpoint is useful once multiple machines need the same routing posture.')
    watchouts.push('Cloud endpoints should define dashboard auth, API keys, TLS, and provider secret handling before launch.')
  } else {
    score += selection.team === 'solo' ? 6 : 1
    if (selection.team === 'team') watchouts.push('Localhost is fast for one operator, but teams usually need a documented rollout path.')
  }

  if (selection.primary === 'subscription') {
    score += 5
    reasons.push('Using paid subscriptions first helps recover value from quotas that often reset unused.')
  } else if (selection.primary === 'free') {
    score += 2
    watchouts.push('Free-first routes are attractive, but production teams should keep a paid backup for reliability.')
  } else {
    score += 4
    reasons.push('Cheap API providers make good fallback lanes when subscription quotas are exhausted.')
  }

  if (selection.team === 'team') {
    score += 4
    reasons.push('Team use benefits from plan review, provider policy, and purchase context before credentials are connected.')
  }

  score = Math.max(48, Math.min(96, score))

  const recommendedPlanId: PlanId = selection.team === 'team' || selection.deployment !== 'local' ? 'pro' : 'starter'
  const fitLabel = score >= 86 ? 'Strong route' : score >= 72 ? 'Ready to plan' : 'Pilot carefully'
  const selectedTool = toolConfig[selection.tool]
  const modelStack =
    selection.fallback === 'three'
      ? selectedTool.defaultModel.split(' -> ')
      : selectedTool.defaultModel.split(' -> ').slice(0, 2)
  const deploymentLine =
    selection.deployment === 'docker'
      ? 'docker run -d -p 20128:20128 -v "$HOME/.9router:/app/data" -e DATA_DIR=/app/data --name 9router 9router'
      : selection.deployment === 'cloud'
        ? 'Set a secured 9router cloud endpoint, then route CLI tools to https://your-router.example/v1'
        : 'npm install -g 9router && 9router'

  const modules = [
    { label: 'Client', detail: `${selectedTool.label} points to a 9router OpenAI-compatible endpoint.` },
    { label: 'Route stack', detail: modelStack.join(' -> ') },
    {
      label: 'Token posture',
      detail: selection.tokenPolicy === 'rtk' ? 'RTK saver on for tool_result compression.' : 'Detailed logs preserved for review-heavy work.',
    },
    {
      label: 'Deployment',
      detail:
        selection.deployment === 'docker'
          ? 'Docker with persistent DATA_DIR volume.'
          : selection.deployment === 'cloud'
            ? 'Cloud endpoint requires auth, TLS, and secret boundaries.'
            : 'Local dashboard on port 20128.',
    },
  ]

  return {
    fitScore: score,
    fitLabel,
    recommendedPlanId,
    headline:
      score >= 72
        ? 'This 9router setup is ready for a managed rollout plan.'
        : 'Start with a smaller pilot before routing team traffic.',
    endpoint: selectedTool.endpoint,
    modelStack,
    estimatedInputSavings: selection.tokenPolicy === 'rtk' ? '20-40%' : 'Audit-first',
    runShape:
      selection.fallback === 'three'
        ? 'Subscription quota -> cheap model -> free continuity'
        : 'Primary model -> backup route',
    reasons,
    watchouts: watchouts.length ? watchouts : ['Keep provider credentials outside prompts, logs, and public issue trackers.'],
    modules,
    configLines: [
      selectedTool.endpoint,
      `Model route: ${modelStack.join(' -> ')}`,
      `Token policy: ${selection.tokenPolicy === 'rtk' ? 'RTK saver enabled' : 'Detailed logging review'}`,
      deploymentLine,
    ],
    operatorMessage:
      recommendedPlanId === 'pro'
        ? 'Pro annual is the clean default for a team 9router rollout.'
        : 'Starter can validate the path, but Pro annual is usually better once team traffic touches the router.',
  }
}
