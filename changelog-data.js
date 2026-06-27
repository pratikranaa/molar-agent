// Changelog entries — add new releases here (one file, tab-filtered by product).

window.CHANGELOG_PRODUCTS = [
  { id: 'all', label: 'All' },
  { id: 'molar', label: 'Molar' },
  { id: 'cartographer', label: 'Cartographer' },
  { id: 'clones', label: 'Clones' },
  { id: 'guard', label: 'Guard' },
  { id: 'trace', label: 'Trace' },
];

window.CHANGELOG_ENTRIES = [
  {
    id: 'molar-2026-06-28',
    product: 'molar',
    date: '2026-06-28',
    version: '0.4.0',
    title: 'Surface subdomains, clone catalog, and changelog',
    tags: ['Feature', 'Docs'],
    items: [
      'Product surfaces live on cartographer, clones, guard, and trace subdomains.',
      'Archal-style clone catalog on the homepage with per-clone docs at /docs/clones/:id.',
      'Book a demo Calendly CTA in the nav; dock-inspired footer with product updates subscribe.',
      'Tabbed changelog for platform and per-product release notes.',
    ],
  },
  {
    id: 'clones-2026-06-27',
    product: 'clones',
    date: '2026-06-27',
    version: '0.3.2',
    title: '28 stateful service clones in catalog',
    tags: ['Feature'],
    items: [
      'Stripe, GitHub, SendGrid, Twilio, Auth0, S3, and 22 more clones in the public registry.',
      'Preview badges for launch-ready vs architecture-preview clones.',
      'Per-clone docs with connect strings, coverage tables, and agent tool references.',
    ],
  },
  {
    id: 'cartographer-2026-06-26',
    product: 'cartographer',
    date: '2026-06-26',
    version: '0.2.1',
    title: 'Playwright export and MCP tools',
    tags: ['Feature', 'Agents'],
    items: [
      'Export discovered flows as Playwright specs from the crawl graph.',
      'MCP connector exposes map, run, and trace tools for coding agents.',
      'Dedicated landing at cartographer.molar.it with surface-specific nav.',
    ],
  },
  {
    id: 'guard-2026-06-25',
    product: 'guard',
    date: '2026-06-25',
    version: '0.2.0',
    title: 'Production guard public beta',
    tags: ['Feature'],
    items: [
      'Continuous production checks on critical paths after deploy.',
      'PR gating integration — block merge when guard scenarios fail.',
      'guard.molar.it landing with live scenario status mockups.',
    ],
  },
  {
    id: 'trace-2026-06-24',
    product: 'trace',
    date: '2026-06-24',
    version: '0.1.0',
    title: 'Trace standalone runtime preview',
    tags: ['Feature'],
    items: [
      'Session replay and step-level failure context for guard runs.',
      'trace.molar.it landing with timeline and diff previews.',
      'Links from Guard failures open directly in Trace.',
    ],
  },
  {
    id: 'molar-2026-06-20',
    product: 'molar',
    date: '2026-06-20',
    version: '0.3.0',
    title: 'Public beta launch',
    tags: ['Launch'],
    items: [
      'molar init → first guard scenario in under 60 seconds.',
      'Free tier: 1 project, 500 test runs/month.',
      'BYOK provider support — no single-vendor lock-in.',
    ],
  },
];

window.getChangelogEntries = function getChangelogEntries(product) {
  const entries = window.CHANGELOG_ENTRIES.slice().sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  if (!product || product === 'all') return entries;
  return entries.filter((e) => e.product === product);
};
