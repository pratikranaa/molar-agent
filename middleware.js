// Subdomain → surface landing. Rewrites run before static index.html is served.
const SURFACE_BY_HOST = {
  'cartographer.molar.it': '/cartographer/index.html',
  'clones.molar.it': '/clones/index.html',
  'guard.molar.it': '/guard/index.html',
  'trace.molar.it': '/trace/index.html',
};

export default function middleware(request) {
  const url = new URL(request.url);
  const dest = SURFACE_BY_HOST[url.hostname];
  if (!dest) return;

  const path = url.pathname;
  if (path === '/' || path === '/index.html') {
    return Response.rewrite(new URL(dest, url));
  }
}

export const config = {
  matcher: ['/', '/index.html'],
};
