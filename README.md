# KolkoTok - redesign demo

Static site: `index.html`, `css/style.css`, `js/main.js`. No build step.

## Publish on GitHub Pages
1. Create a repo (e.g. `kolkotok-demo`) and upload the contents of this folder to the repo root.
2. Settings > Pages > Source: `main` branch, `/ (root)`.
3. Add a file named `CNAME` in the root containing only your demo hostname, e.g. `kolkotok.hackera.online`.

## Cloudflare DNS (DNS only)
1. DNS > Add record: type `CNAME`, name `kolkotok`, target `<github-user>.github.io`.
2. Proxy status: **DNS only** (grey cloud).
3. Back in GitHub Pages, enter the custom domain and enable **Enforce HTTPS** once the certificate is issued.

## Notes
- Images are loaded from kolkotok.bg for the demo. Before handing over, download them into an `img/` folder and update the paths.
- `index.html` contains `<meta name="robots" content="noindex, nofollow">` so the demo stays out of search results. Remove it for the live launch.
- Links point to the live pages on kolkotok.bg.
