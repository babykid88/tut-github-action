# Cloudflare Worker CI/CD demo (GitHub Actions)

This is a tiny Cloudflare Worker API + GitHub Actions pipeline:

- On every **push** and **pull request**: run TypeScript typecheck + unit tests
- On **push to `main`** (after CI passes): deploy to **Cloudflare Workers**

## Endpoints

- `GET /health` → `{ "ok": true }`
- `GET /hello?name=Ada` → `{ "message": "Hello, Ada!" }`

## Local commands

```bash
npm install
npm test
npm run typecheck
```

To run locally with Cloudflare tooling:

```bash
npm run dev
```

## GitHub Actions workflow

The workflow lives at `.github/workflows/ci-cd.yml`.

- **CI job** runs on `pull_request` and `push`
- **Deploy job** runs only when the event is `push` and the branch is `main`

## Deploy setup (Cloudflare + GitHub secrets)

### 1) Create a Cloudflare API token

In Cloudflare dashboard: **My Profile → API Tokens → Create Token**.

Use either:

- **Edit Cloudflare Workers** template, or
- A custom token with **least privilege** like:
  - **Account** → **Workers Scripts** → **Edit**
  - (Optional, if you later add routes) **Account** → **Workers Routes** → **Edit**

This token is used by `wrangler deploy`.

### 2) Get your Cloudflare Account ID

You can find it in the Cloudflare dashboard (right sidebar in many pages) or via `wrangler whoami` on your machine.

### 3) Add GitHub repository secrets

In GitHub repo: **Settings → Secrets and variables → Actions → New repository secret**.

Add:

- `CLOUDFLARE_API_TOKEN`: the token created above
- `CLOUDFLARE_ACCOUNT_ID`: your Cloudflare account id

## How the CI/CD flow works

- Push code / open PR → GitHub Actions runs `npm ci`, `npm run typecheck`, `npm test`
- Merge PR to `main` → GitHub Actions runs the same checks, then runs `npm run deploy` (which executes `wrangler deploy`)

