# Frontend — Inventory Management

## Local development

```bash
npm install
cp .env.example .env
npm run dev
```

Set `VITE_API_URL` in `.env` to your backend URL (default: `http://127.0.0.1:8000`).

## Deploy on Vercel

### Option A — Root directory `frontend` (recommended)

1. Import the repo in [Vercel](https://vercel.com).
2. Set **Root Directory** to `frontend`.
3. Framework preset: **Vite** (auto-detected).
4. Add environment variable:
   - `VITE_API_URL` = `https://inventory-backend-b1za.onrender.com` (or your backend URL)
5. Deploy.

`frontend/vercel.json` handles SPA routing (React Router).

### Option B — Deploy from repo root

Use the root `vercel.json` (builds `frontend/` automatically). Set `VITE_API_URL` in Vercel project settings.

## Build

```bash
npm run build
npm run preview
```
