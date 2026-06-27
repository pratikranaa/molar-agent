// Tabbed changelog — timeline layout inspired by magicuidesign/changelog-template.

function formatChangelogDate(iso) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function ChangelogPage() {
  const products = window.CHANGELOG_PRODUCTS;
  const initialTab = React.useMemo(() => {
    const hash = (window.location.hash || '').replace(/^#/, '');
    const param = new URLSearchParams(window.location.search).get('product');
    const pick = param || hash;
    if (pick && products.some((p) => p.id === pick)) return pick;
    return 'all';
  }, []);

  const [tab, setTab] = React.useState(initialTab);
  const entries = window.getChangelogEntries(tab);

  const selectTab = (id) => {
    setTab(id);
    const url = new URL(window.location.href);
    if (id === 'all') {
      url.searchParams.delete('product');
      window.history.replaceState(null, '', url.pathname + url.hash);
    } else {
      url.searchParams.set('product', id);
      window.history.replaceState(null, '', url.pathname + '?' + url.searchParams.toString());
    }
  };

  React.useEffect(() => {
    document.title = tab === 'all'
      ? 'Changelog — Molar'
      : `Changelog — ${products.find((p) => p.id === tab)?.label || tab} — Molar`;
  }, [tab]);

  return (
    <>
      <main className="doc-page changelog-page">
        <div className="frame">
          <div className="doc-meta">
            <span className="num">Changelog</span>
            <span className="rule"></span>
            <span>Releases</span>
          </div>

          <header className="changelog-header">
            <h1 className="changelog-title">What we <em>shipped</em></h1>
            <p className="changelog-lede">
              Product updates for Molar and each surface — Cartographer, Clones, Guard, and Trace.
            </p>
          </header>

          <div className="changelog-tabs" role="tablist" aria-label="Product filter">
            {products.map((p) => (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={tab === p.id}
                className={'changelog-tab' + (tab === p.id ? ' is-active' : '')}
                onClick={() => selectTab(p.id)}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="changelog-timeline" role="tabpanel">
            {entries.length === 0 ? (
              <p className="changelog-empty">No releases yet for this product.</p>
            ) : (
              entries.map((entry) => (
                <article key={entry.id} className="changelog-entry">
                  <div className="changelog-entry-date">
                    <time dateTime={entry.date}>{formatChangelogDate(entry.date)}</time>
                    {entry.version && (
                      <span className="changelog-version mono">v{entry.version}</span>
                    )}
                  </div>
                  <div className="changelog-entry-rail" aria-hidden="true">
                    <span className="changelog-entry-dot"></span>
                  </div>
                  <div className="changelog-entry-body">
                    <div className="changelog-entry-product mono">
                      {products.find((p) => p.id === entry.product)?.label || entry.product}
                    </div>
                    <h2 className="changelog-entry-title">{entry.title}</h2>
                    {entry.tags && entry.tags.length > 0 && (
                      <div className="changelog-tags">
                        {entry.tags.map((tag) => (
                          <span key={tag} className="changelog-tag">{tag}</span>
                        ))}
                      </div>
                    )}
                    <ul className="changelog-items">
                      {entry.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))
            )}
          </div>

          <a className="doc-back" href="/"><span className="arrow">←</span> Back to home</a>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

const changelogRoot = document.getElementById('changelog-root');
if (changelogRoot) {
  ReactDOM.createRoot(changelogRoot).render(<ChangelogPage />);
}
