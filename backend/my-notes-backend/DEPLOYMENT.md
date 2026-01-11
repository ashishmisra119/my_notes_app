Fly.io + Supabase deployment (MVP)

Overview

- This app is containerized and configured to deploy to Fly.io.
- Use Supabase (free tier) for Postgres DB.

Quick steps (local)

1. Install flyctl: https://fly.io/docs/hands-on/install-flyctl/
2. Create an app on Fly:
   - flyctl apps create my-notes-backend
3. Set secrets (replace values):
   - flyctl secrets set DB_HOST=<supabase-host> DB_PORT=5432 DB_NAME=<db> DB_USER=<user> DB_PASSWORD=<password>
4. Deploy once to create resources:
   - cd backend/my-notes-backend
   - flyctl deploy --config fly.toml

Set up Supabase

1. Create a new project on https://supabase.com
2. Create a database and note connection details
3. Run `flyctl secrets set DB_HOST=<host> DB_PORT=5432 DB_NAME=<db> DB_USER=<user> DB_PASSWORD=<pass>`

CI (GitHub Actions)

- The workflow at `.github/workflows/fly-deploy.yml` will build and deploy on pushes to `main`.
- You must add `FLY_API_TOKEN` to your GitHub repo secrets.

Railway & Vercel CI

- I added a GitHub Actions workflow to build, test, and deploy the backend to Railway: `.github/workflows/deploy-backend-railway.yml`.

  Required repository secrets for the Railway workflow:

  - `RAILWAY_API_KEY` — your Railway API key (use the project / personal token)
  - `RAILWAY_PROJECT_ID` — (optional) Railway project id (if you need to link)
  - `RAILWAY_SERVICE_NAME` — (optional) the service name inside your Railway project

- For the frontend, Vercel supports direct Git integration and will auto-deploy on push when you connect the repository via the Vercel dashboard. Alternatively, you can use Vercel CLI or set up a workflow to run tests/builds before deploying.

- To configure Vercel for production, set this environment variable in the Vercel project settings:
  - `VITE_BACKEND_URL` = `https://<your-backend>.up.railway.app`

Notes

- Actuator endpoints are exposed (`/actuator/health`, `/actuator/prometheus`) on the management port (8081 by default).
- Do NOT store secrets in repo; use `flyctl secrets set` or GitHub Secrets instead.

Local demo (Docker Compose) ✅

- Start the full stack (web, backend, db):

  - From the repo root run:

    docker compose -f backend/my-notes-backend/docker-compose.dev.yml up --build -d

- The frontend will be served at `http://localhost:${WEB_HOST_PORT:-5173}` (default 5173) and will proxy `/api` to the backend.
- To run a quick end-to-end smoke test (register, login, create a note):

  - node scripts/smoke_test.js http://localhost:5173

- To stop and remove containers and volumes:
  - docker compose -f backend/my-notes-backend/docker-compose.dev.yml down -v

Security note

- The compose adds a default `JWT_SECRET` for convenience during local demos; for production ALWAYS set a strong `JWT_SECRET` using environment variables (e.g., `JWT_SECRET` and `JWT_EXPIRATION_MS`).
