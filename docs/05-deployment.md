# Deployment

The site is a static SPA hosted on **Firebase Hosting** (a Google Cloud product). No server runtime, no database. This doc covers first-time setup, day-to-day deploys, and CI.

## Prerequisites

- Google account with billing enabled (Firebase Hosting has a generous free tier — Spark plan — that's almost certainly enough for a wedding invitation; upgrade to Blaze only if you want to use a custom domain via Cloud Run, etc.).
- Local: Node 20+, the Firebase CLI (`npm install -g firebase-tools`).

## One-time setup

### 1. Create the Firebase project

```bash
# Authenticate
firebase login

# Initialize hosting in this repo
firebase init hosting
```

Answers to the prompts:

- **Project**: Create new → name it e.g. `wedding-[surname]`. Firebase project IDs are global; pick something unique.
- **Public directory**: `build/client` (this is where React Router v7 puts the built static SPA when SSR is off).
- **Single-page app rewrites**: **Yes**. This is the key choice — every unknown path rewrites to `index.html` so client-side routing works. Both `/groom` and `/bride` resolve to the same `index.html`; React Router takes over and renders the right side-aware version.
- **GitHub Actions auto-deploy**: Yes, if you want CI set up automatically. Otherwise, set up the workflow manually (template in `.github/workflows/deploy.yml` — see CI section below).

This produces a `firebase.json` and `.firebaserc` at the repo root.

### 2. Confirm `firebase.json`

It should look like:

```json
{
  "hosting": {
    "public": "build/client",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(woff2|woff|ttf|otf)",
        "headers": [
          { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" },
          { "key": "Access-Control-Allow-Origin", "value": "*" }
        ]
      },
      {
        "source": "**/*.@(jpg|jpeg|gif|png|webp|avif|svg)",
        "headers": [
          { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
        ]
      },
      {
        "source": "**/*.@(js|css)",
        "headers": [
          { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
        ]
      },
      {
        "source": "/index.html",
        "headers": [
          { "key": "Cache-Control", "value": "no-cache" }
        ]
      }
    ]
  }
}
```

The cache headers matter. Vite hashes asset filenames, so they're safe to cache forever; `index.html` must not be cached, otherwise users will keep loading old JS bundles.

### 3. Switch React Router to SPA mode

Edit `react-router.config.ts`:

```ts
export default {
  ssr: false,
} satisfies Config;
```

Then `npm run build` produces a static `build/client/` directory.

## Day-to-day: deploy

```bash
npm run build
firebase deploy --only hosting
```

Output is a URL like `https://wedding-[surname].web.app` and `https://wedding-[surname].firebaseapp.com`. Both work; pick one to share or set up a custom domain.

### Preview channels (recommended)

Before pushing changes to live, deploy to a temporary preview URL:

```bash
firebase hosting:channel:deploy preview-2026-05-10
```

This gives a URL that auto-expires in 7 days. Useful for sharing drafts with the couple before going live.

## Sharing the per-side links

After deploy, you'll be sharing **two** links with guests:

```
https://your-domain.com/groom     ← send to groom-side guests
https://your-domain.com/bride      ← send to bride-side guests
```

Don't share the bare root URL (`https://your-domain.com/`) by default — guests should land directly on the right side. Pick the right one when copying into Zalo / Messenger. Bookmark both in a notes app so the wrong link doesn't accidentally go out.

## Custom domain

Optional but worth it for a personal feel. From the Firebase Console → Hosting → "Add custom domain":

1. Enter the domain (e.g. `cuoi.example.vn`).
2. Firebase asks you to add a TXT record at the registrar (verifies ownership).
3. Then asks you to add A or AAAA records pointing to Firebase's IPs.
4. Firebase issues a managed SSL cert via Let's Encrypt within 24h.

> **[TBD]** Domain name — couple to confirm if they want one and from which registrar (Mắt Bão / Tenten / Namecheap / Cloudflare).

## CI: deploy on push to main

`firebase init hosting` can scaffold this for you. The resulting `.github/workflows/firebase-hosting-merge.yml` looks roughly like:

```yaml
name: Deploy to Firebase Hosting on merge
on:
  push:
    branches: [main]
jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT_WEDDING }}
          channelId: live
          projectId: wedding-[surname]
```

Firebase generates the service-account secret for you during `firebase init` if you say yes to GitHub setup.

A second workflow for PR previews (`firebase-hosting-pull-request.yml`) deploys to a preview channel and comments the URL on the PR. Worth keeping.

## Cost expectations

Firebase Hosting Spark (free) plan limits:

- 10 GB stored
- 360 MB/day egress (about 12,000 page loads/day for a ~30KB-gzipped page)
- 1 custom domain with managed SSL

For a wedding invitation site, you'll never hit these. Stay on Spark.

## Rollback

If a deploy breaks something, roll back from the Firebase Console:

- Hosting → Release history → click an older version → "Rollback".

This is instant; no rebuild needed.

## Things deliberately not in scope

- **Cloud Run** / SSR. We're not running a Node server. If we ever need it, Firebase Hosting can rewrite to Cloud Run, but for v1 it's pure static.
- **Firestore / Realtime DB**. Out of scope — no backend.
- **Authentication**. Out of scope.
- **Cloud Functions**. Out of scope unless we add a server-side RSVP that writes somewhere; even then, a Google Form is simpler.
