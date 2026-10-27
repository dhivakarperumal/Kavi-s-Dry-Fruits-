# SEO build and GoDaddy deployment

The storefront uses normal path URLs and generates static SEO HTML for public pages, products, combos, and categories during the production build.

## Build

From the repository root:

```powershell
npm --prefix Frontend run build
```

The build calls the live catalog API to generate `Frontend/public/sitemap.xml`, then writes crawlable page HTML under `Frontend/dist/`. The public catalog API must be reachable during the build. If the API is hosted at a different address, set `VITE_API_URL` to its base URL (including `/api`) in the build environment.

## GoDaddy cPanel upload

1. Build the frontend as above.
2. Upload the **contents** of `Frontend/dist/` to the domain's document root (commonly `public_html`), preserving all nested folders and files.
3. Make sure `.htaccess` is uploaded; some FTP clients hide dotfiles. It provides Apache rewrites for direct storefront URLs and client-side routes.
4. Confirm the deployed `robots.txt` and `sitemap.xml` are available at the site root.
5. In Google Search Console, verify the canonical domain and submit `https://kavisdryfruits.com/sitemap.xml`.

The structured business data declares the store's actual Tirupattur address and Tamil Nadu/India delivery areas. Do not create location pages or claim physical branches in towns where the business has no address. Keep the canonical host, business details, and API URL aligned with the actual production deployment.
