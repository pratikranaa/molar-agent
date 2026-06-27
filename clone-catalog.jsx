// Clone catalog panel — icons + preview badges for the homepage Clones section.

const CLONE_ICON_SLUG = {
  auth: 'clerk',
  s3: 'amazons3',
  stripe: 'stripe',
  twilio: 'twilio',
  calcom: 'caldotcom',
  clickup: 'clickup',
  discord: 'discord',
  github: 'github',
  gitlab: 'gitlab',
  'google-workspace': 'google',
  hubspot: 'hubspot',
  jira: 'jira',
  linear: 'linear',
  sentry: 'sentry',
  slack: 'slack',
  supabase: 'supabase',
  telegram: 'telegram',
  typeform: 'typeform',
  webflow: 'webflow',
  woocommerce: 'woocommerce',
};

const CLONE_ICON_DOMAIN = {
  sendgrid: 'sendgrid.com',
  apify: 'apify.com',
  firecrawl: 'firecrawl.dev',
  ramp: 'ramp.com',
  tavily: 'tavily.com',
  ownerrez: 'ownerrez.com',
  pricelabs: 'pricelabs.co',
};

const CLONE_ICON_URL = {
  unipile: 'https://www.unipile.com/wp-content/uploads/2020/12/cropped-favicon-150x150.png',
};

const CLONE_PREVIEW_BADGE = {
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

const CLONE_DISPLAY_NAME = {
  auth: 'auth',
  s3: 's3',
  sendgrid: 'sendgrid',
  calcom: 'cal.com',
  'google-workspace': 'google\u00a0workspace',
  ownerrez: 'ownerrez',
  pricelabs: 'pricelabs',
};

const SIMPLE_ICONS_JSdelivr = 'https://cdn.jsdelivr.net/npm/simple-icons@11.14.0/icons';

function formatCloneName(id) {
  if (CLONE_DISPLAY_NAME[id]) return CLONE_DISPLAY_NAME[id];
  return id.replace(/-/g, ' ');
}

function cloneDocsUrl(id) {
  return `/docs/clones/${id}`;
}

function formatBadgeLabel(badge) {
  if (!badge) return badge;
  return badge
    .replace('architecture preview', 'arch preview')
    .replace('launch preview', 'launch');
}

function clonePreviewBadge(id, state) {
  if (state === 'shadow') return 'shadow mirror';
  return CLONE_PREVIEW_BADGE[id] || null;
}

function cloneIconMeta(id) {
  if (CLONE_ICON_URL[id]) {
    return { sources: [CLONE_ICON_URL[id]], kind: 'brand' };
  }

  const slug = CLONE_ICON_SLUG[id];
  if (slug) {
    return { sources: [`${SIMPLE_ICONS_JSdelivr}/${slug}.svg`], kind: 'mono' };
  }

  const domain = CLONE_ICON_DOMAIN[id];
  if (domain) {
    return { sources: [`https://icons.duckduckgo.com/ip3/${domain}.ico`], kind: 'brand' };
  }

  return { sources: [], kind: 'fallback' };
}

function CloneIcon({ id, name }) {
  const { sources, kind } = cloneIconMeta(id);
  const [sourceIndex, setSourceIndex] = React.useState(0);
  const letter = (name || id).charAt(0).toUpperCase();

  if (!sources.length || sourceIndex >= sources.length) {
    return <span className="clone-catalog-icon clone-catalog-icon--fallback" aria-hidden>{letter}</span>;
  }

  const iconClass = kind === 'mono'
    ? 'clone-catalog-icon clone-catalog-icon--mono'
    : 'clone-catalog-icon clone-catalog-icon--brand';

  return (
    <img
      className={iconClass}
      src={sources[sourceIndex]}
      alt=""
      width={20}
      height={20}
      loading="lazy"
      decoding="async"
      onError={() => setSourceIndex((index) => index + 1)}
    />
  );
}

function CloneCatalogPanel({ integrations }) {
  const [query, setQuery] = React.useState('');
  const normalizedQuery = query.trim().toLowerCase();

  const filtered = integrations.filter(([id, state]) => {
    if (!normalizedQuery) return true;
    const name = formatCloneName(id);
    const badge = formatBadgeLabel(clonePreviewBadge(id, state)) || '';
    const haystack = [id, name, badge, state].join(' ').toLowerCase();
    return haystack.includes(normalizedQuery);
  });

  return (
    <div className="clone-catalog" aria-label="Clone service catalog">
      <div className="clone-catalog-head">
        <div className="clone-catalog-head-copy">
          <div className="clone-catalog-kicker">
            <span className="clone-catalog-kicker-title">Clones</span>
            <span className="clone-catalog-kicker-sub">Catalog</span>
          </div>
          <p className="clone-catalog-lede">
            Each clone is a stateful stand-in for a real API — same endpoints, controllable failure shapes.
            Preview badges flag clones that are replay-backed, in launch preview, below our 95% completeness
            bar, or still being measured.
          </p>
        </div>
        <div className="clone-catalog-head-actions">
          <span className="clone-catalog-count">Released · {integrations.length}</span>
          <label className="clone-catalog-search">
            <span className="clone-catalog-search-label">Search</span>
            <input
              type="search"
              className="clone-catalog-search-input"
              placeholder="Filter clones…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search clones"
            />
          </label>
        </div>
      </div>

      <div className="clone-catalog-body">
        {filtered.length === 0 ? (
          <p className="clone-catalog-empty">No clones match “{query.trim()}”.</p>
        ) : (
          <ul
            className={`clone-catalog-grid${filtered.length <= 6 ? ' clone-catalog-grid--few' : ''}`}
            style={filtered.length <= 6 ? { '--clone-cols': filtered.length } : undefined}
          >
            {filtered.map(([id, state]) => {
              const name = formatCloneName(id);
              const badge = formatBadgeLabel(clonePreviewBadge(id, state));
              return (
                <li className="clone-catalog-item" key={id}>
                  <div className="clone-catalog-item-main">
                    <CloneIcon id={id} name={name} />
                    <span className="clone-catalog-name">{name}</span>
                  </div>
                  <div className="clone-catalog-item-footer">
                    <a
                      className="clone-catalog-docs"
                      href={cloneDocsUrl(id)}
                    >
                      Docs →
                    </a>
                    {badge ? <span className="clone-catalog-badge">{badge}</span> : null}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

window.CloneCatalogPanel = CloneCatalogPanel;
