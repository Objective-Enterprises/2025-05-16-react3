# ThreadHive Frontend — Agent Guide

Reddit-style forum SPA built with **React 19 + Vite 6 + React Router 7 + React-Bootstrap 5**. Plain JavaScript (JSX), no TypeScript. Talks to a REST backend at `http://localhost:5000/api` (see [src/api/apiClient.js](src/api/apiClient.js#L1)).

## Commands

- `npm run dev` — start Vite dev server
- `npm run build` — production build
- `npm run lint` — ESLint (flat config in [eslint.config.js](eslint.config.js))
- `npm run preview` — preview built bundle

No test runner is configured.

## Auth

The AuthContext is central store for data about the current user. Always use the `useAuth()` hook to access and control the current user and their token. Do not use localStorage directly. Access data about the current user with the `user` and `token` properties from `useAuth()`, and control the current user with the `loginUser`, `logout`, and `updateUser` functions from `useAuth()`.

## Architecture

Strict layering — keep new code on the right side of these boundaries:

```
pages/  ──uses──▶  services/  ──uses──▶  api/apiClient.js  ──hits──▶  backend
components/                  config/apiConfig.js (endpoint constants)
context/AuthContext  (auth + localStorage)
```

- **`src/api/apiClient.js`** — single `fetchAPI(endpoint, options)` helper. Auto-injects `Authorization: Bearer <token>` from `localStorage`, sets JSON `Content-Type`, throws an `Error` with `error.response = { status, data }` on non-2xx. **All HTTP must go through this**; do not call `fetch` directly elsewhere.
- **`src/config/apiConfig.js`** — every endpoint path lives here as a constant or path-builder function (e.g. `THREAD_API.GET_BY_ID(id)`). **Add new endpoints here, never inline URL strings in services.**
- **`src/services/*.js`** — one file per resource (`threadService`, `commentService`, `authService`, `subredditService`). Each function calls `fetchAPI` with a `*_API` constant and returns `response.data` (the backend wraps payloads as `{ data: ... }`). Pages/components import services, never `apiClient` directly.
- **`src/context/AuthContext.jsx`** — `AuthProvider` + `useAuth()` hook exposing `{ token, user, loginUser, logout, updateUser }`. Persists to `localStorage` keys `token` and `user`; tolerates the literal strings `"undefined"`/`"null"`.
- **`src/components/PrivateRoute/PrivateRoute.jsx`** — route guard; wrap protected `<Route element={...}>` children with it (see [src/App.jsx](src/App.jsx#L1)).
- **`src/utils/handleApiError.js`** — on 401 clears localStorage and hard-redirects to `/login`. Use this in catch blocks when you want auto-logout behavior; otherwise read `err.response?.data?.message ?? err.message`.

## Conventions

- **Files**: components are `PascalCase.jsx` with a sibling `PascalCase.css` in their own folder under `src/components/<Name>/`. Pages follow `src/pages/<Area>/<Name>.jsx` + `.css`.
- **Styling**: React-Bootstrap components (`Container`, `Card`, `Button`, …) + per-component CSS files + global `src/App.css` / `src/index.css`. Bootstrap and `bootstrap-icons` CSS are imported globally in [src/main.jsx](src/main.jsx).
- **Imports**: relative paths only (no path aliases configured in [jsconfig.json](jsconfig.json)).
- **State**: local `useState` + `AuthContext`. No Redux / Zustand / React Query — data fetching is `useEffect` + service call + local state (see [src/pages/User/ThreadPage.jsx](src/pages/User/ThreadPage.jsx#L21) for the canonical pattern, including parallel fetches via `Promise.all`).
- **Lint rule worth knowing**: `no-unused-vars` ignores identifiers matching `^[A-Z_]` (PascalCase / SCREAMING_SNAKE_CASE imports won't error if unused).
- **React 19 + react-refresh**: keep files exporting only components (or use `allowConstantExport`); mixing component + non-component exports in one file triggers a warning.

## Adding a feature — checklist

1. Add endpoint constant(s) to [src/config/apiConfig.js](src/config/apiConfig.js).
2. Add a function in the appropriate `src/services/<resource>Service.js` (or create a new service file) that calls `fetchAPI` and returns `response.data`.
3. Consume from a page/component via the service. Don't import `apiClient` or hardcode URLs outside `config/` and `api/`.
4. For auth-gated pages, wrap the route in `<PrivateRoute>` inside [src/App.jsx](src/App.jsx).

## Known gotchas

- API base URL is hardcoded in [src/api/apiClient.js](src/api/apiClient.js#L1) (no `.env`). The Render URL is commented out — swap the two lines to target prod.
- Backend must be running on `localhost:5000` for `npm run dev` to do anything useful.
- `App.jsx` imports `ThreadPage` and `CreateThreadForm` but does not currently route to them — add `<Route>` entries when wiring those views.
- `localStorage` values may be the strings `"undefined"`/`"null"` from earlier bugs; preserve the defensive parsing in `AuthContext` if you refactor it.
