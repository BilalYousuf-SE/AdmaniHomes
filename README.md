# Admani Homes — Real Estate Listing & Lead Platform

A full-stack real estate site: public visitors browse properties and submit
enquiries with no sign-up; an admin (password-protected) manages listings and
tracks leads through a status pipeline.

```
realestate/
├── backend/     Spring Boot 3 (Java 17) REST API + PostgreSQL
└── frontend/    React 18 + Vite
```

## What's included

**Public site**
- Browse/search properties (city, sale/rent, type, price range, keyword) — no login
- Property detail page with photo gallery
- "Send enquiry" lead form with client + server-side email/phone validation

**Admin dashboard** (JWT-protected, username + password)
- Add / edit / delete properties, toggle visibility
- View all leads, filter by status, update status: **Yet to contact → In process → Done**
- Delete stale/spam leads

**Security**
- Admin passwords hashed with BCrypt; JWT (HS256) for session auth, no passwords stored client-side
- Public API can never read leads back — the submit endpoint only returns a thank-you message
- Server-side validation on every field (email regex, phone regex, length limits) — never trust the client
- Rate limiting on lead submission and login to blunt spam/brute force
- CORS locked to your frontend's exact origin (not `*`)
- Generic error messages to clients; no stack traces or internal details leaked
- All secrets (DB credentials, JWT secret, admin password) come from environment variables — nothing sensitive is committed to git

---

## 1. Run it locally first

### Backend
Requires Java 17 and a local PostgreSQL (or use a free cloud Postgres — see deployment section — even for local dev).

```bash
cd backend
cp .env.example .env    # edit with your local DB credentials
# export the vars in .env into your shell, or use a tool like `direnv`/`dotenv`
mvn spring-boot:run
```
The API runs on `http://localhost:8080`. On first boot, it creates an admin
account using `ADMIN_USERNAME` / `ADMIN_PASSWORD` from your env.

### Frontend
Requires Node 18+.

```bash
cd frontend
cp .env.example .env    # VITE_API_URL=http://localhost:8080
npm install
npm run dev
```
Visit `http://localhost:5173`. Admin login is at `/admin/login`.

---

## 2. Deploying for free

This stack fits comfortably on free tiers for a small/medium real-estate site
(hundreds to low-thousands of visits/month). Recommended combo:

| Piece | Where | Why |
|---|---|---|
| Backend (Spring Boot) | **Render** (free Web Service) | Free tier runs a Docker/Java web service; easiest for Spring Boot |
| Database (PostgreSQL) | **Render Postgres (free)** or **Neon** or **Supabase** | All have a genuinely free managed Postgres tier |
| Frontend (React build) | **Vercel** or **Netlify** | Best free static hosting, auto-deploys from git, free HTTPS |

You could also deploy backend+DB together on **Railway**'s free trial credit,
or use **Fly.io** for the backend — the steps below use Render + Vercel
since they have the most durable always-free tiers as of writing, but the
repo works unmodified anywhere that runs a Java 17 web service and serves a
static SPA build.

### Step 1 — Push to GitHub
Create a repo and push `backend/` and `frontend/` (or the whole `realestate/`
folder as one repo — either works, you'll just point each host at the right
subfolder).

### Step 2 — Database (pick one, free)
**Option A: Render Postgres**
1. Render dashboard → New → PostgreSQL → free plan.
2. Once created, copy the **Internal Database URL** (if backend is also on
   Render) or **External Database URL**.

**Option B: Neon** (neon.tech) — generous always-free Postgres, good if you
want the DB independent of your compute host.
1. Create a project → copy the connection string.

Either way you'll get something like:
`postgresql://user:password@host:5432/dbname`
Spring Boot needs it in JDBC form:
`jdbc:postgresql://host:5432/dbname` (with username/password as separate
env vars, matching `application.properties` in this repo).

### Step 3 — Backend on Render
1. Render dashboard → New → Web Service → connect your repo, root directory
   `backend`.
2. Environment: **Docker** (this repo includes a `Dockerfile`) — Render will
   build and run it automatically. (Alternatively choose "Java" runtime and
   let Render auto-detect Maven; the Dockerfile is the more predictable path.)
3. Add environment variables (Render → Environment tab):
   - `DATABASE_URL` = `jdbc:postgresql://<host>:<port>/<db>`
   - `DATABASE_USERNAME`, `DATABASE_PASSWORD`
   - `JWT_SECRET` = a long random string (`openssl rand -base64 48`)
   - `ADMIN_USERNAME`, `ADMIN_PASSWORD` = your admin login (set a strong password)
   - `CORS_ALLOWED_ORIGINS` = your future Vercel URL, e.g. `https://meridian-homes.vercel.app`
     (you'll fill this in after Step 4, then redeploy)
   - `DDL_AUTO` = `update`
4. Deploy. Render gives you a URL like `https://meridian-backend.onrender.com`.
5. Confirm it's alive: `https://meridian-backend.onrender.com/actuator/health`
   should return `{"status":"UP"}`.

> **Free-tier note:** Render's free web services spin down after ~15 minutes
> of inactivity and take 30–60s to wake on the next request. Fine for a
> low-traffic listings site; if that cold start is a problem, look at
> Render's paid "always-on" tier, or use a free uptime pinger (e.g.
> UptimeRobot hitting `/actuator/health` every 10 min) to keep it warm.

### Step 4 — Frontend on Vercel
1. Vercel dashboard → New Project → import your repo, root directory `frontend`.
2. Framework preset: Vite. Build command `npm run build`, output `dist`
   (Vercel auto-detects this).
3. Add environment variable: `VITE_API_URL` = your Render backend URL
   (`https://meridian-backend.onrender.com`).
4. Deploy. You'll get `https://your-project.vercel.app`.
5. Go back to Render and set `CORS_ALLOWED_ORIGINS` to that exact Vercel URL,
   then redeploy the backend so it accepts requests from your live frontend.

### Step 5 — Verify end to end
- Visit your Vercel URL → listings load (empty at first).
- Go to `/admin/login`, sign in with `ADMIN_USERNAME` / `ADMIN_PASSWORD`.
- Add a property, confirm it shows on the public site.
- Submit a lead from the public site, confirm it appears under Admin → Leads.
- Change its status and confirm it updates.

### Traffic capacity on the free tier
- Render free web service: shared CPU, 512MB RAM — comfortably handles a
  typical real-estate listings site (tens of thousands of requests/month is
  fine; it's the always-on limit and cold start that you'll notice before
  raw throughput becomes an issue).
- Free Postgres tiers (Render/Neon/Supabase) cap storage at ~0.5–1GB and a
  connection limit in the dozens — plenty for property/lead data, which is
  small and mostly text.
- Vercel/Netlify free static hosting has generous bandwidth (100GB/month+)
  — the bottleneck for a media-heavy site will be image sizes, not requests.

**Practical tip:** host property photos as URLs to an image host (Cloudinary
free tier, Imgur, or your own S3/Cloudflare R2 free tier) rather than
uploading through this app — the admin form already accepts arbitrary image
URLs, so no extra backend storage or file upload code is required, and it
keeps hosting free and fast.

---

## 3. Managing the admin account after launch
- The seeded admin is created once, on first boot, from `ADMIN_USERNAME` /
  `ADMIN_PASSWORD`. After that, the seeder just no-ops if the account exists.
- To rotate the password, easiest path: connect to your Postgres (Render/Neon
  dashboard has a SQL console) and either delete the row from `admin_users`
  and redeploy with new env vars, or update `password_hash` directly with a
  freshly BCrypt-hashed value.
- To add more admin accounts, insert additional rows into `admin_users` the
  same way (there's no self-serve "invite admin" UI by design, to keep the
  attack surface small for a small team).

## 4. Extending this later
- Swap `ddl-auto=update` for a real migration tool (Flyway/Liquibase) once
  the schema stabilizes, for safer production changes.
- Add image upload (e.g. to Cloudflare R2 or Cloudinary) directly from the
  admin form instead of pasting URLs, if that becomes annoying.
- Add pagination-aware sitemap/SEO metadata if you want search engines to
  index individual listings well.
