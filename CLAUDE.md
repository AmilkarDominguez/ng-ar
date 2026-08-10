# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project purpose

This is an Angular 21 application that integrates **MindAR** (image/marker tracking) with **A-Frame** (WebXR/3D scene framework) to build an augmented-reality visualizer that runs in the browser. The AR scene lives in `src/app/ar-viewer/` and is rendered as the app's home route.

- MindAR and A-Frame are global-script libraries (loaded via `angular.json`'s `scripts` array, not npm imports) with their own custom-element lifecycle (`<a-scene>`, `<a-entity>`, the `mindar-image`/`mindar-image-target` attributes). They sit outside Angular's change detection, which is why `ArViewer` declares `schemas: [CUSTOM_ELEMENTS_SCHEMA]` instead of importing component classes for them.
- Load order matters: `aframe-master.min.js` must come before `mindar-image-aframe.prod.js` in `angular.json` `architect.build.options.scripts`, since MindAR's bundle registers itself onto the global `AFRAME` object at load time.
- MindAR/A-Frame manipulate the DOM directly and request `navigator.mediaDevices` (camera) on scene start — this app is CSR-only (no `@angular/ssr`), so there's no hydration/server guard to worry about.
- Production budgets in `angular.json` were raised (`initial` warning 4MB / error 6MB) because the bundled AR libraries (`aframe` + `mind-ar` + `three`) are inherently large (~3MB) — don't reflexively shrink these back down.
- `mind-ar` was installed with `npm install --ignore-scripts` because its `canvas` dependency (used only by MindAR's Node-based target compiler, not by the browser runtime) needs native build tools unavailable on this machine. This is safe since nothing in the app imports `canvas`.

### Marker targets and 3D content

- `public/targets/targets.mind` — the compiled MindAR marker file (see `public/targets/README.md` for how to generate one from an image).
- `public/models/model.glb` — the glTF model shown over the marker once tracked, rendered via A-Frame's core `<a-gltf-model>` + `animation-mixer` (plays any animation clips embedded in the file; see `public/models/README.md` for scale/position tuning tips).

Neither file is checked in; without them the scene still loads, but tracking/model rendering silently 404s in the console. `ArViewer` exposes a `targetFound` signal (toggled from `targetFound`/`targetLost` events on the `mindar-image-target` entity) that drives the on-screen scanning hint.

## Commands

- `npm start` / `ng serve` — run the dev server at `http://localhost:4200/`, auto-reloads on source changes.
- `ng build` — production build, output to `dist/`.
- `ng build --configuration development` — unoptimized build with source maps.
- `npm test` / `ng test` — run unit tests via the Vitest-based Angular unit-test builder (`@angular/build:unit-test`).
- `ng generate component <name>` — scaffold a new standalone component (SCSS styles by default, per `angular.json` schematics config).

There is no e2e test setup and no lint script configured in `package.json`.

## Architecture

Standard Angular CLI v21 standalone-app structure (no NgModules):

- `src/main.ts` bootstraps `App` (`src/app/app.ts`) using `appConfig` from `src/app/app.config.ts`.
- `src/app/app.config.ts` wires up application-wide providers: `provideBrowserGlobalErrorListeners()` and `provideRouter(routes)`.
- `src/app/app.routes.ts` maps `''` to `ArViewer` (`src/app/ar-viewer/ar-viewer.ts`), the AR scene component.
- Components are standalone (`imports: [...]` on the `@Component` decorator, no `declarations`).
- Styling: SCSS per component (`schematics` default in `angular.json`); global styles in `src/styles.scss` (resets `html`/`body` to fill the viewport for the full-bleed AR view).
- Static assets, including MindAR target files, are served from `public/`.

TypeScript is configured in strict mode with additional strictness flags (`strictTemplates`, `strictInjectionParameters`, `strictInputAccessModifiers`, `noImplicitOverride`, `noImplicitReturns`, etc.) — follow these when adding code, especially around typing third-party globals from MindAR/A-Frame (which don't ship first-party Angular/TS types).
