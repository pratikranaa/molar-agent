# molar-it

Public home for **[Molar](https://molar.it)** — continuous QA testing platform & autonomous AI agent.

This repo contains the marketing site source (`molar.it`). Product code lives in the private Molar monorepo under `../` (sibling checkout: `Molar/molar.it/`).

## Live site

| | |
|---|---|
| **Website** | https://molar.it |
| **Cartographer** | https://cartographer.molar.it |
| **Clones** | https://clones.molar.it |
| **Guard** | https://guard.molar.it |
| **Trace** | https://trace.molar.it |
| **QA Agent** | https://molar.it/qa-agent |
| **Docs** | https://molar.it/docs |
| **App** | https://app.molar.it |

## Quickstart

```bash
npx molar-agent init
```

## Develop locally

```bash
cd molar.it   # from monorepo root, or clone this repo standalone
python3 -m http.server 8080
# open http://localhost:8080
```

Deploy: `vercel --prod` (Vercel project `molar` → molar.it).

Surface landings use subdomains (`cartographer.molar.it`, etc.). Add each as a domain on the Vercel project and point DNS (CNAME to `cname.vercel-dns.com`). Old paths (`/cartographer`, …) 301 to the subdomain.

## SEO / launch

See [`seo-launch-kit/00-START-HERE.txt`](seo-launch-kit/00-START-HERE.txt) for Search Console, directory listings, and launch post templates.

## Contact

- pratik@molar.it
- [LinkedIn](https://www.linkedin.com/in/ranapratik/)

© 2026 Molar Labs · Bengaluru
