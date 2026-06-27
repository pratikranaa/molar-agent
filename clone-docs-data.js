// Per-clone documentation — used by /docs/clones/:id pages.

const CLONE_DOC_HOSTS = {
  auth: 'api.clerk.com',
  s3: 's3.amazonaws.com',
  sendgrid: 'api.sendgrid.com',
  stripe: 'api.stripe.com',
  twilio: 'api.twilio.com',
  apify: 'api.apify.com',
  calcom: 'api.cal.com',
  clickup: 'api.clickup.com',
  discord: 'discord.com/api',
  firecrawl: 'api.firecrawl.dev',
  github: 'api.github.com',
  gitlab: 'gitlab.com/api/v4',
  'google-workspace': 'www.googleapis.com',
  hubspot: 'api.hubapi.com',
  jira: 'your-domain.atlassian.net',
  linear: 'api.linear.app',
  ownerrez: 'api.ownerrez.com',
  pricelabs: 'api.pricelabs.co',
  ramp: 'api.ramp.com',
  sentry: 'sentry.io/api',
  slack: 'slack.com/api',
  supabase: 'your-project.supabase.co',
  tavily: 'api.tavily.com',
  telegram: 'api.telegram.org',
  typeform: 'api.typeform.com',
  unipile: 'api.unipile.com',
  webflow: 'api.webflow.com',
  woocommerce: 'your-store.com/wp-json/wc/v3',
};

function cloneDisplayName(id) {
  const names = {
    auth: 'Auth (Clerk)',
    s3: 'S3',
    sendgrid: 'SendGrid',
    calcom: 'Cal.com',
    'google-workspace': 'Google Workspace',
    ownerrez: 'OwnerRez',
    pricelabs: 'PriceLabs',
  };
  return names[id] || id.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

const CLONE_SEEDS = {
  apify: ['empty'],
  auth: ['demo', 'empty'],
  calcom: ['demo', 'empty'],
  clickup: ['empty'],
  discord: ['empty', 'harvested', 'small-server'],
  firecrawl: ['empty'],
  github: ['ci-cd-pipeline', 'empty', 'enterprise-repo', 'large-backlog', 'merge-conflict', 'permissions-denied', 'rate-limited', 'small-project', 'stale-issues'],
  gitlab: ['empty'],
  'google-workspace': ['assistant-baseline', 'calendar-packed-week', 'draft-send-cleanup', 'empty', 'gmail-busy-inbox'],
  hubspot: ['empty'],
  jira: ['empty', 'enterprise', 'large-backlog', 'small-project', 'sprint-active'],
  linear: ['busy-backlog', 'empty', 'engineering-org', 'multi-team', 'small-team'],
  ownerrez: ['empty'],
  pricelabs: ['empty'],
  ramp: ['default', 'empty', 'ramp-expense-split', 'ramp-receipt-mismatch'],
  sendgrid: ['empty'],
  sentry: ['demo', 'empty'],
  slack: ['busy-workspace', 'empty', 'engineering-team', 'incident-active'],
  supabase: ['bulk-user-deletion', 'ecommerce', 'edge-cases', 'empty', 'feature-flag-override-mismatch', 'fired-employee-access', 'migration-poisoned-comment', 'rls-bypass-migration', 'saas-starter', 'small-project', 'vaultline-ecommerce'],
  tavily: ['empty'],
  telegram: ['empty'],
  twilio: ['empty'],
  typeform: ['empty'],
  unipile: ['empty'],
  webflow: ['empty'],
  woocommerce: ['demo', 'empty'],
};

const DEEP_CLONE_SEEDS = ['empty', 'smoke', 'demo'];

const FIXTURE_DEFAULT_NOTES = [
  'Fixture-replay clone — recorded JSON responses with vendor-shaped status codes and error bodies.',
  'Unmatched routes return an explicit unimplemented response instead of proxying to the live vendor.',
  'Use the global Molar clones MCP (`molar_clone_spawn`, `molar_clone_seed`, `molar_clone_route`) — fixture clones do not expose per-vendor MCP tool servers.',
];

function formatSeedsLine(id, tier) {
  if (tier === 'cloned' || tier === 'shadow') {
    return `Built-in seeds: ${DEEP_CLONE_SEEDS.map((s) => `\`${s}\``).join(', ')}. Pass \`--seed\` to \`molar clones spawn ${id}\`.`;
  }
  const seeds = CLONE_SEEDS[id] || ['empty'];
  if (seeds.length <= 8) {
    return `Common seeds: ${seeds.map((s) => `\`${s}\``).join(', ')}. Pass \`--seed\` to \`molar clones spawn ${id}\`.`;
  }
  const shown = seeds.slice(0, 6);
  return `Common seeds: ${shown.map((s) => `\`${s}\``).join(', ')}, and ${seeds.length - 6} more. Pass \`--seed\` to \`molar clones spawn ${id}\`.`;
}

const CLONE_PREVIEW_STATUS = {
  apify: 'launch preview',
  calcom: 'launch preview',
  clickup: 'launch preview',
  discord: 'launch preview',
  gitlab: 'launch preview',
  'google-workspace': 'launch preview',
  hubspot: 'architecture preview',
  jira: 'launch preview',
  ownerrez: 'architecture preview',
  pricelabs: 'architecture preview',
  ramp: 'architecture preview',
  sentry: 'launch preview',
  sendgrid: 'launch preview',
  stripe: 'launch preview',
  tavily: 'architecture preview',
  twilio: 'launch preview',
  unipile: 'architecture preview',
  webflow: 'architecture preview',
  auth: 'launch preview',
  firecrawl: 'launch preview',
  typeform: 'launch preview',
  woocommerce: 'launch preview',
};

function previewKnownLimits(name, preview, tier) {
  if (tier === 'shadow') {
    return 'S3 is a shadow mirror — object storage semantics without touching real buckets.';
  }
  if (tier === 'cloned') {
    return 'Deep clone with vendor-faithful state, virtual clock, and world snapshots.';
  }
  if (preview === 'architecture preview') {
    return `${name} is an architecture preview — API contracts are modeled and startable; replay depth and completeness are still expanding toward the 95% bar.`;
  }
  if (preview === 'launch preview') {
    return `${name} is in launch preview — core REST flows run in isolated sessions; coverage is below public GA and still being measured.`;
  }
  return `${name} is REST-first and fixture-backed today. Coverage expands release over release.`;
}

function defaultCloneDoc(id, tier) {
  const name = cloneDisplayName(id);
  const host = CLONE_DOC_HOSTS[id] || `api.${id.replace(/-/g, '')}.com`;
  const deep = tier === 'cloned';
  const shadow = tier === 'shadow';
  const preview = CLONE_PREVIEW_STATUS[id] || null;
  return {
    id,
    title: `${name} clone`,
    tagline: `Test agents against a stateful clone of ${name} with real REST error shapes and controllable workflow state.`,
    tier,
    previewStatus: shadow ? 'shadow mirror' : deep ? 'deep clone' : preview,
    startHere: {
      bestFor: `Agents and test suites that call ${name} during checkout, onboarding, or ops workflows.`,
      connectWith: `Route mode for \`${host}\`, or direct REST base URLs from \`molar clones spawn ${id}\`.`,
      knownLimits: previewKnownLimits(name, preview, tier),
      seeds: formatSeedsLine(id, tier),
    },
    covers: [
      `${name} REST workflows agents rely on in production`,
      'Service-shaped errors, auth handling, and rate-limit shapes',
      'Deterministic state inside isolated clone sessions',
    ],
    surface: `Use route mode when your app already calls \`${host}\`. For manual debugging, start the clone with \`molar clones spawn ${id}\` and use the printed REST base URL.`,
    toolsSubtitle: tier === 'fixtured'
      ? 'Recorded REST operations. Names match fixture ops in molar-clones — call the equivalent vendor REST path at the clone base URL.'
      : 'Stateful REST APIs plus Molar clones MCP helpers where noted.',
    notes: [],
    toolGroups: [],
  };
}

const CLONE_DOC_OVERRIDES = {
  apify: {
    tagline: 'Test Apify scraping agents against a stateful clone of actors, runs, datasets, key-value stores, and request queues with real REST error shapes.',
    startHere: {
      bestFor: 'Agents that launch actors, inspect runs, read datasets, and manage scraping workflow state.',
      connectWith: 'Route mode for `api.apify.com`, or direct REST base URLs from `molar clones spawn apify`.',
      knownLimits: 'Launch preview — fixture-backed coverage for actors, runs, datasets, and key-value stores.',
    },
    covers: [
      'Actors and actor runs',
      'Dataset item reads',
      'Key-value store records',
      'Service-shaped REST errors and auth handling',
    ],
  },
  github: {
    tagline: 'Test GitHub agents against a stateful clone of repos, files, branches, issues, PRs, commits, and workflow runs with real GitHub API error shapes.',
    startHere: {
      bestFor: 'Agents that triage issues, update files, open PRs, review diffs, merge changes, or inspect CI state.',
      connectWith: 'Route mode for `api.github.com`, direct REST base URLs from `molar clones spawn github`, or the global Molar clones MCP (`molar_clone_spawn`, `molar_clone_seed`, `molar_clone_route`).',
      knownLimits: 'Fixture-replay clone. Git transport and every GitHub product surface are not simulated. Tool names map to fixture ops — not a separate GitHub MCP server.',
    },
    notes: [
      'Configurable rate limiting via the `rate-limited` seed.',
      'The `permissions-denied` seed returns 403 on write operations.',
      'Fixture ops replay at GitHub REST paths (for example `GET /repos/{owner}/{repo}/issues`).',
      'Use clone session tokens from `molar clones spawn` — never production PATs in tests.',
    ],
  },
  stripe: {
    tagline: 'Test billing and checkout agents against a stateful Stripe clone with real error shapes — no test-mode gaps, no real charges.',
    startHere: {
      bestFor: 'Checkout flows, subscriptions, invoices, payment intents, and webhook-driven billing automation.',
      connectWith: 'Route mode for `api.stripe.com`, or `molar clones spawn stripe` for a session-scoped REST base URL.',
      knownLimits: 'Deep Go clone — PaymentIntents, Customers, Subscriptions, Checkout Sessions, webhooks, virtual clock, and world snapshots.',
    },
    covers: [
      'PaymentIntents, Customers, and Checkout Sessions',
      'Subscriptions, invoices, and billing portal flows',
      'Webhooks with deterministic delivery inside the clone',
      'Stripe-shaped errors (card declined, rate limits, invalid params)',
    ],
    toolGroups: [
      {
        title: 'MCP helpers',
        tools: [
          ['stripe_advance_clock', 'Advance the Stripe test clock for subscription and dunning flows.'],
          ['molar_clone_advance_clock', 'Advance the session virtual clock across clones.'],
          ['molar_clone_world', 'Snapshot or restore deterministic world state.'],
        ],
      },
    ],
    notes: [
      'Spawn with `molar clones spawn stripe --seed demo` for seeded customers and charges.',
      'Use `molar_clone_route` to intercept `api.stripe.com` in route mode.',
    ],
  },
  sendgrid: {
    tagline: 'Test transactional email flows against a stateful SendGrid clone — capture messages without delivering to real inboxes.',
    startHere: {
      bestFor: 'Signup, password reset, billing receipts, and lifecycle email assertions in E2E tests.',
      connectWith: 'Route mode for `api.sendgrid.com`, or `molar clones spawn sendgrid`.',
      knownLimits: 'Deep Go clone (internal kind `email`) with SMTP capture and REST mail send APIs.',
    },
    covers: ['Mail send APIs', 'Template and personalization fields', 'Captured message inspection', 'Bounce and deferral error shapes'],
    toolGroups: [
      {
        title: 'MCP helpers',
        tools: [
          ['email_inbox', 'Read captured messages from the in-memory inbox for assertions.'],
        ],
      },
    ],
  },
  twilio: {
    tagline: 'Test SMS and voice workflows against a stateful Twilio clone with real REST error shapes.',
    startHere: {
      bestFor: 'OTP, notification, and IVR flows that depend on Twilio message state.',
      connectWith: 'Route mode for `api.twilio.com`, or `molar clones spawn twilio`.',
      knownLimits: 'Deep Go clone focused on Messages API, Verify, and delivery status transitions.',
    },
    covers: ['Outbound messages', 'Delivery status webhooks', 'Account and messaging service context', 'Twilio-shaped 4xx validation errors'],
    toolGroups: [
      {
        title: 'MCP helpers',
        tools: [
          ['twilio_last_otp', 'Read the last OTP code issued in the clone session.'],
        ],
      },
    ],
  },
  auth: {
    tagline: 'Test Clerk-style auth flows against a stateful auth clone — sessions, users, and org membership without real identities.',
    startHere: {
      bestFor: 'Signup, login, magic links, org invites, and session-gated routes in agent-driven tests.',
      connectWith: 'Route mode for Clerk-compatible endpoints, or `molar clones spawn auth`.',
      knownLimits: 'Deep Go clone — session and user state are fully isolated per run with deterministic seed IDs.',
    },
    covers: ['Users and sessions', 'Organizations and memberships', 'Magic links and verification', 'JWT/session cookie shapes'],
    toolGroups: [
      {
        title: 'MCP helpers',
        tools: [
          ['auth_seed_users', 'Seed deterministic users into the auth clone for a run.'],
        ],
      },
    ],
  },
  s3: {
    tagline: 'Test upload and asset flows against an S3 shadow mirror — same SDK calls, no real bucket writes.',
    startHere: {
      bestFor: 'File uploads, presigned URLs, and asset pipelines that talk to S3-compatible APIs.',
      connectWith: 'Point AWS SDK at the clone base URL from `molar clones spawn s3`.',
      knownLimits: 'Shadow mirror — in-memory object store with S3 semantics, not full AWS parity.',
    },
    covers: ['Put/Get object operations', 'List and prefix semantics', 'Presigned URL generation', 'Access-denied error shapes'],
    toolGroups: [
      {
        title: 'MCP helpers',
        tools: [
          ['s3_create_bucket', 'Create a bucket in the shadow store.'],
          ['s3_put', 'Put an object by bucket and key.'],
          ['s3_list', 'List objects under a bucket prefix.'],
        ],
      },
    ],
  },
  slack: {
    tagline: 'Test Slack bots and workflow automations against a stateful Slack API clone — channels, messages, and reactions without posting to real workspaces.',
    covers: ['chat.postMessage and channel reads', 'Thread replies and reactions', 'Workspace auth and rate-limit shapes', 'Webhook event delivery inside the clone'],
  },
  linear: {
    tagline: 'Test issue-tracking agents against a stateful Linear clone — issues, cycles, labels, and team workflows with REST-shaped errors.',
    covers: ['Issue create and update', 'Team and project scoping', 'Label and state transitions', 'Linear-shaped validation errors'],
  },
  discord: {
    tagline: 'Test Discord bot flows against a stateful Discord API clone — guilds, channels, and messages without touching production servers.',
    covers: ['Guild and channel reads', 'Message send and edit', 'Interaction callbacks', 'Discord rate-limit and permission errors'],
  },
  supabase: {
    tagline: 'Test Supabase management workflows against a fixture clone — projects, branches, secrets, and migrations without a live project.',
    startHere: {
      bestFor: 'Agents that inspect project config, branch diffs, secrets metadata, and migration state.',
      knownLimits: 'Launch preview — Supabase Management API fixtures. Not a full Postgres runtime, Auth service, or Storage backend.',
    },
    covers: ['Project and branch reads', 'Secrets and config metadata', 'Migration and RLS scenario seeds', 'Supabase-shaped 4xx errors'],
  },
  sentry: {
    tagline: 'Test Sentry triage agents against a stateful clone of organizations, projects, issues, latest events, stack traces, and releases with real REST errors.',
    startHere: {
      bestFor: 'Agents that inspect production errors, read stack traces, triage issues, and connect releases to failures.',
      connectWith: 'Direct REST base URLs from `molar clones spawn sentry`.',
      knownLimits: 'Launch preview — read-focused fixtures. Event ingest, issue mutations, and the Sentry web UI are not simulated.',
    },
    covers: [
      'Organizations and projects',
      'Issue list and detail reads',
      'Latest event with stack traces',
      'Release history',
    ],
    notes: [
      'REST routes use Sentry `/api/0/...` path shapes.',
      'The `demo` seed includes a sample organization, project, issue, stack-trace event, and release.',
    ],
  },
  hubspot: {
    tagline: 'Test CRM and marketing automations against a HubSpot architecture-preview clone — contacts, deals, and pipeline state in isolation.',
    covers: ['Contact and company records', 'Deal pipeline updates', 'Engagement timestamps', 'HubSpot OAuth and quota errors'],
  },
  calcom: {
    tagline: 'Test scheduling flows against a Cal.com launch-preview clone — bookings, availability, and calendar hooks without real calendar writes.',
    covers: ['Event type and availability reads', 'Booking create and cancel', 'Webhook payloads', 'Cal.com validation errors'],
  },
  jira: {
    tagline: 'Test Jira automation agents against a stateful Atlassian clone — issues, transitions, and sprint fields with Jira REST error shapes.',
    covers: ['Issue create and transition', 'Project and sprint context', 'Comment and attachment stubs', 'Jira 400/404 error bodies'],
  },
  gitlab: {
    tagline: 'Test GitLab CI and repo agents against a GitLab API clone — projects, merge requests, and pipelines without touching real remotes.',
    covers: ['Project and MR reads', 'Pipeline status APIs', 'File and branch operations', 'GitLab REST error shapes'],
  },
  firecrawl: {
    tagline: 'Test web-scrape agents against a Firecrawl launch-preview clone — crawl jobs and extracted content without hitting the live API quota.',
    covers: ['Crawl job submission', 'Scrape result reads', 'Status polling', 'Firecrawl rate-limit errors'],
  },
  clickup: {
    tagline: 'Test task automation against a ClickUp clone — lists, tasks, and status changes with ClickUp REST semantics.',
    covers: ['Task create and update', 'List and folder hierarchy', 'Assignee and status fields', 'ClickUp auth errors'],
  },
  woocommerce: {
    tagline: 'Test WooCommerce store flows against a REST clone — orders, products, and customers without a live WordPress store.',
    covers: ['Product catalog reads', 'Order create and status', 'Customer records', 'WooCommerce REST auth and validation'],
  },
  typeform: {
    tagline: 'Test form and survey agents against a Typeform clone — forms, responses, and webhooks without production form traffic.',
    covers: ['Form definition reads', 'Response submission', 'Webhook delivery', 'Typeform 4xx shapes'],
  },
  webflow: {
    tagline: 'Test Webflow content agents against an Architecture Preview with recording-backed Data API v2 routes and focused CMS overlays.',
    startHere: {
      bestFor: 'Content agents that read sites and pages, manage CMS collections and items, or wire webhooks.',
      connectWith: 'Direct REST base URLs from `molar clones spawn webflow`.',
      knownLimits: 'Architecture Preview: recording-replay backed with focused CMS overlays. Full publish lifecycle semantics are not modeled yet.',
    },
    covers: ['Sites and pages', 'CMS collections and items', 'Assets', 'Forms', 'Webhooks'],
    notes: [
      'Use Webflow when your agent manages CMS content state across collections and items.',
    ],
  },
  telegram: {
    tagline: 'Test Telegram bot flows against a Bot API clone — messages, updates, and chat state without contacting real users.',
    covers: ['sendMessage and getUpdates', 'Chat and user context', 'Inline keyboard callbacks', 'Telegram 429 rate limits'],
  },
  'google-workspace': {
    tagline: 'Test Google Workspace automations against a launch-preview clone — Gmail, Calendar, and Drive-shaped APIs in isolated sessions.',
    covers: ['Gmail message reads', 'Calendar event create', 'Drive file metadata', 'Google OAuth and quota errors'],
  },
  ownerrez: {
    tagline: 'Test vacation-rental ops against an OwnerRez architecture-preview clone — bookings, guests, and property state.',
    covers: ['Booking and guest records', 'Property calendar reads', 'Webhook-shaped updates', 'OwnerRez API auth'],
  },
  pricelabs: {
    tagline: 'Test dynamic-pricing integrations against a PriceLabs architecture-preview clone — listings and rate recommendations.',
    covers: ['Listing sync reads', 'Nightly rate updates', 'Recommendation payloads', 'PriceLabs API errors'],
  },
  ramp: {
    tagline: 'Test spend and card workflows against a Ramp architecture-preview clone — transactions and limits without real money movement.',
    covers: ['Transaction reads', 'Card and limit context', 'Receipt metadata', 'Ramp OAuth errors'],
  },
  tavily: {
    tagline: 'Test research agents against a Tavily architecture-preview clone — search queries and citations without live search quota.',
    covers: ['Search query submission', 'Result and citation reads', 'Answer payloads', 'Tavily rate-limit shapes'],
  },
  unipile: {
    tagline: 'Test unified inbox agents against a Unipile architecture-preview clone — email, calendar, and messaging APIs in one session.',
    covers: ['Account connection reads', 'Message thread fetch', 'Calendar event sync', 'Unipile webhook stubs'],
  },
};

const CLONE_REGISTRY = /*CLONES-REGISTRY-BEGIN*/[
  ['auth', 'cloned'],
  ['s3', 'shadow'],
  ['sendgrid', 'cloned'],
  ['stripe', 'cloned'],
  ['twilio', 'cloned'],
  ['apify', 'fixtured'],
  ['calcom', 'fixtured'],
  ['clickup', 'fixtured'],
  ['discord', 'fixtured'],
  ['firecrawl', 'fixtured'],
  ['github', 'fixtured'],
  ['gitlab', 'fixtured'],
  ['google-workspace', 'fixtured'],
  ['hubspot', 'fixtured'],
  ['jira', 'fixtured'],
  ['linear', 'fixtured'],
  ['ownerrez', 'fixtured'],
  ['pricelabs', 'fixtured'],
  ['ramp', 'fixtured'],
  ['sentry', 'fixtured'],
  ['slack', 'fixtured'],
  ['supabase', 'fixtured'],
  ['tavily', 'fixtured'],
  ['telegram', 'fixtured'],
  ['typeform', 'fixtured'],
  ['unipile', 'fixtured'],
  ['webflow', 'fixtured'],
  ['woocommerce', 'fixtured'],
]/*CLONES-REGISTRY-END*/;

function generatedToolGroups(slug) {
  return window.CLONE_ROUTE_GROUPS?.[slug] || [];
}

function generatedOpCount(slug) {
  const groups = generatedToolGroups(slug);
  return groups.reduce((n, g) => n + g.tools.length, 0);
}

function resolveToolGroups(slug, override, base) {
  const generated = generatedToolGroups(slug);
  const manual = override.toolGroups || [];
  if (generated.length && manual.length) return [...generated, ...manual];
  if (generated.length) return generated;
  return manual.length ? manual : base.toolGroups;
}

function resolveSummary(slug, override) {
  if (override.summary) return override.summary;
  const n = generatedOpCount(slug);
  if (n > 0) {
    const name = cloneDisplayName(slug);
    return `${n} recorded fixture operations. Error responses match real ${name} API shapes (status codes, validation errors, rate limits).`;
  }
  return null;
}

function getCloneDoc(id) {
  const entry = CLONE_REGISTRY.find(([k]) => k === id);
  if (!entry) return null;
  const [slug, tier] = entry;
  const base = defaultCloneDoc(slug, tier === 'cloned' ? 'cloned' : tier === 'shadow' ? 'shadow' : 'fixtured');
  const override = CLONE_DOC_OVERRIDES[slug] || {};
  const mergedStartHere = { ...base.startHere, ...(override.startHere || {}) };
  if (!override.startHere?.seeds) {
    mergedStartHere.seeds = formatSeedsLine(slug, base.tier);
  }
  const mergedNotes = [
    ...(base.tier === 'fixtured' ? FIXTURE_DEFAULT_NOTES : base.notes),
    ...(override.notes || []),
  ];
  return {
    ...base,
    ...override,
    summary: resolveSummary(slug, override) || override.summary,
    previewStatus: override.previewStatus || base.previewStatus,
    startHere: mergedStartHere,
    covers: override.covers || base.covers,
    toolsSubtitle: override.toolsSubtitle || base.toolsSubtitle,
    notes: mergedNotes,
    toolGroups: resolveToolGroups(slug, override, base),
  };
}

function listCloneDocIds() {
  return CLONE_REGISTRY.map(([id]) => id);
}

window.getCloneDoc = getCloneDoc;
window.listCloneDocIds = listCloneDocIds;
window.cloneDisplayName = cloneDisplayName;
