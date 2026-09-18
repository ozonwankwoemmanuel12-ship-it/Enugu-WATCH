# Community Watch

A production frontend for a Nigerian community safety platform. Residents report incidents, community leaders coordinate, and authorised patrol personnel verify and respond — all through one trusted interface.

Built with **Vite + React + React Router** and wired to the live Community Watch API.

## Features

- **Landing page** with live platform statistics from `GET /public/stats` (graceful fallback when unavailable).
- **Authentication** — register, login, logout, and session verification on load.
- **Dashboard** — personal overview with active incidents, alerts, and platform stats.
- **Incidents** — list with functional filters for status, category, priority and zone, plus debounced search.
- **Incident detail** — upvote/confirm, comments, officer status updates, and owner delete.
- **Report an incident** — structured form with categories, priorities, zones and emergency prefill.
- **Profile** — update name, zone and phone.
- **Patrols** — start a shift, log checkpoints, and end a patrol (patrol officers/admins).
- **Alerts** — filterable safety alerts; admins can broadcast new alerts.
- Clean loading, empty and error states throughout, plus responsive layout and reduced-motion support.

## Tech stack

| Area | Choice |
| --- | --- |
| Build tool | Vite 6 |
| UI | React 19 |
| Routing | React Router 7 |
| Styling | Hand-written CSS design system (`src/index.css`) |
| Testing | Vitest + Testing Library (jsdom) |
| Linting | ESLint 9 (flat config) |

## Getting started

Requires Node.js 20+ and npm.

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## Environment variables

Copy `.env.example` to `.env` and adjust if needed:

```env
VITE_API_BASE_URL=https://1-community-watch-api.vercel.app/api/v1
VITE_API_TIMEOUT_MS=15000
```

Vite inlines `VITE_*` variables at build time, so set them in your hosting provider's environment before deploying.

## Available scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build for production into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run test` | Run the test suite once |

> On Windows PowerShell where `npm.ps1` is blocked by execution policy, use `npm.cmd` instead (e.g. `npm.cmd run build`).

## Authentication

The API sets its session cookie as host-only with `SameSite=Lax` and no `Secure`/`Domain` attributes, so browsers never attach it to cross-origin `fetch()` requests from this SPA. The API therefore exposes a JWT bearer flow for cross-domain clients: `POST /auth/register` and `POST /auth/login` return a `token` in the response body.

This app uses **Bearer token authentication** via the `Authorization: Bearer <token>` header. The token is persisted in `localStorage` (`src/lib/api.js`) and cleared on logout or a `401` response.

### Roles

| Role | Access |
| --- | --- |
| `resident` | Dashboard, incidents, reporting, profile, alerts |
| `patrol_officer` | Everything above, plus the Patrols workflow |
| `admin` | Everything above, plus alert broadcasting |

Roles are assigned by the backend. Registration always creates a `resident`.

## Project structure

```
src/
  auth/            Auth context, provider, hook and route guard
  components/      Shared UI + landing sections
    landing/       Marketing sections for the home page
  layouts/         Public and authenticated app shells
  lib/             API client, constants, formatters, hooks
  pages/           Route-level pages
  test/            Test setup and app smoke tests
public/            Static assets (favicon, SPA redirects)
```

## Error handling

The API returns status-code-only responses with empty bodies. The client maps status codes to safe, friendly messages in `friendlyHttpError()` (`src/lib/api.js`) via the `ApiError` class.

## Testing

```bash
npm run test
```

The suite covers constants/semantic colour rules, formatters, API error mapping, and full-app smoke tests (landing stats, auth redirect, login success/failure, dashboard, incident filters, role gating and the 404 page).

## Deployment

Build output is a static SPA in `dist/`. Config for both hosts is included:

- **Vercel** — `vercel.json` (framework `vite`, output `dist`, SPA rewrites).
- **Netlify** — `netlify.toml` and `public/_redirects` (publish `dist`, SPA fallback).

SPA rewrites are required so deep links such as `/login` and `/app/incidents/:id` do not 404 on refresh.

## License

Private and proprietary.
