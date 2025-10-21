<!--
This file is generated to help AI coding agents be immediately productive in this repository.
Keep it concise and concrete. Update if project structure or build scripts change.
-->
# Copilot / AI agent instructions for chatbox

Short, actionable guidance to work on this Electron + Vue + TypeScript repo.

- Project layout
  - Main process: `src/main/index.ts` — creates BrowserWindow, registers `ipcMain` handlers and sets `preload` path to `../preload/index.js` (built output lives under `out/main` when packaged).
  - Preload: `src/preload/index.ts` — exposes `electronAPI` via `contextBridge` and a small `api` object; guard edits to contextIsolation and types in `src/preload/index.d.ts` if present.
  - Renderer: `src/renderer/src/*` — Vue 3 app (`main.ts`, `App.vue`), assets in `src/renderer/src/assets`. Alias `@renderer` maps to `src/renderer/src` via `electron.vite.config.ts`.
  - Static resources: `resources/` (e.g. `resources/icon.png`) referenced from `src/main`.

- Key scripts (use `npm run <script>`)
  - `npm run dev` — start electron-vite dev server (hot reload for renderer + main integration). Use this for local development.
  - `npm run start` — run `electron-vite preview` (preview built app locally).
  - `npm run build` — runs typechecks and `electron-vite build`.
  - Platform builds: `npm run build:win`, `build:mac`, `build:linux` — wrappers around `electron-builder`.
  - `npm run typecheck` / `typecheck:node` / `typecheck:web` — useful before changing type-sensitive code. Do not skip when modifying TS APIs.

- Development conventions & patterns
  - Use TypeScript and the project's tsconfig variants (`tsconfig.node.json`, `tsconfig.web.json`). Keep changes type-safe to satisfy `npm run typecheck`.
  - The main process uses `@electron-toolkit/utils` (see `src/main/index.ts`) — do not remove optimizer calls such as `optimizer.watchWindowShortcuts(window)` unless you know the consequence on keyboard shortcuts.
  - IPC: main registers channels with `ipcMain` (example: `'ping' -> console.log('pong')`). When adding IPC, expose client-side access via the preload `api` or `electron` helper. Follow the pattern in `src/preload/index.ts` — prefer adding to `api` and exposing through `contextBridge` when `process.contextIsolated` is true.
  - Preload sandboxing: `webPreferences.sandbox` is `false` in main; be mindful when changing this and how APIs are exposed.
  - Renderer alias: import from `@renderer/...` for renderer-scoped modules (configured in `electron.vite.config.ts`). Use relative imports for code in main/preload.

- Build/packaging notes
  - Build outputs are placed in `out/*` during packaging; `package.json` `main` points to `./out/main/index.js` — keep this path compatible with build outputs.
  - `postinstall` runs `electron-builder install-app-deps` to prepare native deps; CI that installs dependencies should allow postinstall to run.
  - Auto-updates: `electron-updater` is included in dependencies — when touching update logic, check packaging config in `electron-builder.yml` and test on the target platform.

- Linting & formatting
  - `prettier` and `eslint` are configured; use `npm run format` and `npm run lint` before pushing changes.

- When editing code — quick examples
  - Add a new IPC handler in `src/main/index.ts`:
    - use `ipcMain.handle('my-channel', async (event, args) => { ... })`.
    - expose a caller in `src/preload/index.ts` via `contextBridge.exposeInMainWorld('api', { myCall: (args) => window.electron.invoke('my-channel', args) })` or add to the existing `api` wrapper.
  - Update renderer to call it: `window.api.myCall(payload)` (ensure `d.ts` entry exists for TypeScript).

- Important files to check for context
  - `package.json` — scripts and dependencies
  - `electron.vite.config.ts` — build behavior, renderer alias, externalizeDeps
  - `src/main/index.ts`, `src/preload/index.ts`, `src/renderer/src/main.ts` — runtime entry points
  - `tsconfig.*.json` — typecheck boundaries
  - `electron-builder.yml` & `electron.vite.config.ts` — packaging and build hooks

- Edge cases & safety
  - Avoid changing `preload` path or `contextIsolation` without updating types and verifying renderer access patterns.
  - Running `npm run build` includes typechecks; large type regressions block builds — run `npm run typecheck` locally first.
  - Be conservative with dependency upgrades (Electron, electron-builder, electron-vite) — they affect packaging and native modules.

If anything in this file is unclear or missing, tell me which area you want expanded (dev workflow, packaging, IPC patterns, or typing conventions) and I will update the document.
