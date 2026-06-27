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
      seeds: 'Common seeds: `empty`. See the Seeds guide for preset worlds and failure modes.',
    },
    covers: [
      `${name} REST workflows agents rely on in production`,
      'Service-shaped errors, auth handling, and rate-limit shapes',
      'Deterministic state inside isolated clone sessions',
    ],
    surface: `Use route mode when your app already calls \`${host}\`. For manual debugging, start the clone with \`molar clones spawn ${id}\` and use the printed REST base URL.`,
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
      knownLimits: 'Apify is REST-first and fixture-backed today. Coverage focuses on actor, run, dataset, key-value store, and request queue workflows.',
      seeds: 'Common seeds: `empty`. See the Seeds guide for usage.',
    },
    covers: [
      'Actors and actor runs',
      'Dataset item reads',
      'Key-value store records',
      'Request queue operations',
      'Service-shaped REST errors and auth handling',
    ],
  },
  github: {
    tagline: 'Test GitHub agents against a stateful clone of repos, files, branches, issues, PRs, commits, and workflow runs with real GitHub API error shapes.',
    summary: 'Covers repos, files, branches, issues, PRs, commits, and workflow runs. Error responses match real GitHub API format (status codes, error messages, validation errors).',
    startHere: {
      bestFor: 'Agents that triage issues, update files, open PRs, review diffs, merge changes, or inspect CI state.',
      connectWith: 'Route mode for `api.github.com`, direct REST base URLs from `molar clones spawn github`, or MCP tools.',
      knownLimits: 'Coverage is strongest for REST and MCP workflows. Git transport and every GitHub product surface are not simulated.',
      seeds: 'Common seeds: `small-project`, `enterprise-repo`, `stale-issues`, `merge-conflict`, `empty`. See the Seeds guide for usage.',
    },
    toolGroups: [
      {
        title: 'Repositories',
        tools: [
          ['create_repository', 'Create a new GitHub repository in your account'],
          ['get_repository', 'Get details of a GitHub repository'],
          ['search_repositories', 'Search for GitHub repositories'],
          ['fork_repository', 'Fork a repository to your account or specified organization'],
          ['search_code', 'Search for code across repositories'],
          ['search_users', 'Search for users on GitHub'],
        ],
      },
      {
        title: 'Files',
        tools: [
          ['get_file_contents', 'Get the contents of a file or directory from a repository'],
          ['create_or_update_file', 'Create or update a single file in a repository'],
          ['push_files', 'Push multiple files in a single commit'],
        ],
      },
      {
        title: 'Branches',
        tools: [
          ['create_branch', 'Create a new branch in a repository'],
          ['list_branches', 'List branches in a repository'],
          ['delete_branch', 'Delete a branch from a repository'],
        ],
      },
      {
        title: 'Issues',
        tools: [
          ['create_issue', 'Create a new issue in a repository'],
          ['get_issue', 'Get details of a specific issue'],
          ['list_issues', 'List issues with filtering options'],
          ['update_issue', 'Update an existing issue'],
          ['search_issues', 'Search for issues and pull requests across repositories'],
          ['add_issue_comment', 'Add a comment to an existing issue'],
        ],
      },
      {
        title: 'Pull Requests',
        tools: [
          ['create_pull_request', 'Create a new pull request'],
          ['get_pull_request', 'Get details of a specific pull request'],
          ['list_pull_requests', 'List and filter repository pull requests'],
          ['update_pull_request', 'Update an existing pull request'],
          ['merge_pull_request', 'Merge a pull request'],
          ['get_pull_request_diff', 'Get the diff of a pull request'],
          ['get_pull_request_commits', 'Get commits on a pull request'],
          ['get_pull_request_reviews', 'Get reviews on a pull request'],
          ['create_pull_request_review', 'Create a review on a pull request'],
          ['get_pull_request_files', 'Get the list of files changed in a pull request'],
          ['get_pull_request_status', 'Get the combined status of all status checks'],
          ['update_pull_request_branch', 'Update a PR branch with latest changes from base'],
          ['get_pull_request_comments', 'Get the review comments on a pull request'],
        ],
      },
      {
        title: 'Commits & Workflows',
        tools: [
          ['list_commits', 'Get list of commits of a branch'],
          ['list_workflow_runs', 'List workflow runs for a repository'],
          ['get_workflow_run', 'Get a specific workflow run'],
        ],
      },
    ],
    notes: [
      'Configurable rate limiting via the `rate-limited` seed.',
      'The `permissions-denied` seed returns 403 on write operations.',
      'In hosted sessions, MCP is exposed over HTTPS clone endpoints.',
      'Use clone session tokens from `molar clones spawn` — never production PATs in tests.',
    ],
  },
  stripe: {
    tagline: 'Test billing and checkout agents against a stateful Stripe clone with real error shapes — no test-mode gaps, no real charges.',
    startHere: {
      bestFor: 'Checkout flows, subscriptions, invoices, payment intents, and webhook-driven billing automation.',
      connectWith: 'Route mode for `api.stripe.com`, or `molar clones spawn stripe` for a session-scoped REST base URL.',
      knownLimits: 'Deep clone — strongest coverage on PaymentIntents, Customers, Subscriptions, and Checkout Session flows.',
      seeds: 'Common seeds: `checkout-world`, `declined-card`, `subscription-active`, `empty`.',
    },
    covers: [
      'PaymentIntents, Customers, and Checkout Sessions',
      'Subscriptions, invoices, and billing portal flows',
      'Webhooks with deterministic delivery inside the clone',
      'Stripe-shaped errors (card declined, rate limits, invalid params)',
    ],
  },
  sendgrid: {
    tagline: 'Test transactional email flows against a stateful SendGrid clone — capture messages without delivering to real inboxes.',
    startHere: {
      bestFor: 'Signup, password reset, billing receipts, and lifecycle email assertions in E2E tests.',
      connectWith: 'Route mode for `api.sendgrid.com`, or `molar clones spawn sendgrid`.',
      knownLimits: 'Deep clone with SMTP capture and REST mail send APIs.',
      seeds: 'Common seeds: `empty`, `queued-batch`.',
    },
    covers: ['Mail send APIs', 'Template and personalization fields', 'Captured message inspection', 'Bounce and deferral error shapes'],
  },
  twilio: {
    tagline: 'Test SMS and voice workflows against a stateful Twilio clone with real REST error shapes.',
    startHere: {
      bestFor: 'OTP, notification, and IVR flows that depend on Twilio message state.',
      connectWith: 'Route mode for `api.twilio.com`, or `molar clones spawn twilio`.',
      knownLimits: 'Deep clone focused on Messages API and delivery status transitions.',
      seeds: 'Common seeds: `empty`, `delivery-delayed`.',
    },
    covers: ['Outbound messages', 'Delivery status webhooks', 'Account and messaging service context', 'Twilio-shaped 4xx validation errors'],
  },
  auth: {
    tagline: 'Test Clerk-style auth flows against a stateful auth clone — sessions, users, and org membership without real identities.',
    startHere: {
      bestFor: 'Signup, login, magic links, org invites, and session-gated routes in agent-driven tests.',
      connectWith: 'Route mode for Clerk-compatible endpoints, or `molar clones spawn auth`.',
      knownLimits: 'Deep clone — session and user state are fully isolated per run.',
      seeds: 'Common seeds: `empty`, `multi-org`, `expired-session`.',
    },
    covers: ['Users and sessions', 'Organizations and memberships', 'Magic links and verification', 'JWT/session cookie shapes'],
  },
  s3: {
    tagline: 'Test upload and asset flows against an S3 shadow mirror — same SDK calls, no real bucket writes.',
    startHere: {
      bestFor: 'File uploads, presigned URLs, and asset pipelines that talk to S3-compatible APIs.',
      connectWith: 'Point AWS SDK at the clone base URL from `molar clones spawn s3`.',
      knownLimits: 'Shadow mirror — in-memory object store with S3 semantics, not full AWS parity.',
      seeds: 'Common seeds: `empty`, `prefixed-bucket`.',
    },
    covers: ['Put/Get object operations', 'List and prefix semantics', 'Presigned URL generation', 'Access-denied error shapes'],
  },
  slack: {
    tagline: 'Test Slack bots and workflow automations against a stateful Slack API clone — channels, messages, and reactions without posting to real workspaces.',
    covers: ['chat.postMessage and channel reads', 'Thread replies and reactions', 'Workspace auth and rate-limit shapes', 'Webhook event delivery inside the clone'],
  },
  linear: {
    tagline: 'Test issue-tracking agents against a stateful Linear clone — issues, cycles, labels, and team workflows with GraphQL-shaped errors.',
    covers: ['Issue create and update', 'Team and project scoping', 'Label and state transitions', 'Linear-shaped validation errors'],
  },
  discord: {
    tagline: 'Test Discord bot flows against a stateful Discord API clone — guilds, channels, and messages without touching production servers.',
    covers: ['Guild and channel reads', 'Message send and edit', 'Interaction callbacks', 'Discord rate-limit and permission errors'],
  },
  supabase: {
    tagline: 'Test Supabase-backed apps against a stateful clone — auth, Postgres-shaped REST, and storage without a live project.',
    covers: ['Auth session flows', 'Row-level REST reads and writes', 'Storage upload semantics', 'Supabase-shaped 4xx errors'],
  },
  sentry: {
    tagline: 'Test error-reporting integrations against a stateful Sentry clone — events, issues, and releases without sending data to production.',
    covers: ['Event ingest APIs', 'Issue grouping reads', 'Release and deploy markers', 'Sentry DSN auth handling'],
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
    tagline: 'Test Webflow CMS automations against an architecture-preview clone — collections, items, and publish state in isolation.',
    covers: ['Collection and item CRUD', 'Site and locale context', 'Publish status reads', 'Webflow token auth'],
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

function getCloneDoc(id) {
  const entry = CLONE_REGISTRY.find(([k]) => k === id);
  if (!entry) return null;
  const [slug, tier] = entry;
  const base = defaultCloneDoc(slug, tier === 'cloned' ? 'cloned' : tier === 'shadow' ? 'shadow' : 'fixtured');
  const override = CLONE_DOC_OVERRIDES[slug] || {};
  return {
    ...base,
    ...override,
    previewStatus: override.previewStatus || base.previewStatus,
    startHere: { ...base.startHere, ...(override.startHere || {}) },
    covers: override.covers || base.covers,
    notes: override.notes || base.notes,
    toolGroups: override.toolGroups || base.toolGroups,
  };
}

function listCloneDocIds() {
  return CLONE_REGISTRY.map(([id]) => id);
}

window.getCloneDoc = getCloneDoc;
window.listCloneDocIds = listCloneDocIds;
window.cloneDisplayName = cloneDisplayName;
