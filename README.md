# Jibreel Clinic – frontend

React 19 + Vite + React Router. Talks to the Express API in `../server`.

```bash
pnpm install
pnpm dev      # http://localhost:5173 (requests to /api are proxied to http://localhost:4000)
pnpm build
pnpm lint
```

To point at an API on another host, set `VITE_API_URL` (e.g. `VITE_API_URL=https://api.example.com/api`).

See the [project README](../README.md) for the full setup, demo accounts and API reference.
