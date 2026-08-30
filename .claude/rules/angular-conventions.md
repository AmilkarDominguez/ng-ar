# Regla: convenciones Angular del proyecto

Angular CLI v21, app standalone (sin NgModules).

## Bootstrap y routing

- `src/main.ts` → `bootstrapApplication(App, appConfig)`.
- `src/app/app.config.ts` → providers globales: `provideBrowserGlobalErrorListeners()`,
  `provideRouter(routes)`.
- `src/app/app.routes.ts` → `''` mapea a `ArViewer` (`src/app/ar-viewer/`), la
  escena AR y única ruta.
- `App` (`src/app/app.ts`) solo tiene `<router-outlet />`.

## Componentes

- Standalone: `imports: [...]` en el decorador `@Component`, sin `declarations`.
- Signals para estado (`signal`, `computed`, `asReadonly`). `input()`/`output()`
  functions, no decorators, en componentes nuevos.
- Lifecycle para código que toca el DOM: `afterNextRender()` (no
  `ngAfterViewInit`) — ver `ArViewer`.
- `inject()` en vez de inyección por constructor cuando aplique.
- Control flow nativo en templates: `@if` / `@for` / `@let` / `@switch`.

## Estilos

- SCSS por componente (`schematics` default en `angular.json`).
- Globales en `src/styles.scss` (resetea `html`/`body` a viewport completo para
  la vista AR full-bleed).
- Budget `anyComponentStyle`: warning 4kB / error 8kB por archivo.

## TypeScript — modo estricto ampliado

`tsconfig.json` activa, además de `strict`: `noImplicitOverride`,
`noPropertyAccessFromIndexSignature`, `noImplicitReturns`,
`noFallthroughCasesInSwitch`, `isolatedModules`, y en
`angularCompilerOptions`: `strictTemplates`, `strictInjectionParameters`,
`strictInputAccessModifiers`.

Consecuencia práctica: al tipar globals de MindAR/A-Frame (sin tipos
first-party) hay que declarar interfaces a mano y evitar `any` implícito; usar
`readonly` en las interfaces de datos.

## Comandos

- `npm start` / `ng serve` → dev server en `http://localhost:4200/`.
- `ng build` → build de producción a `dist/` (config `production` por defecto).
- `ng build --configuration development` → sin optimizar, con source maps
  (más rápido para type-check del template).
- `npm test` / `ng test` → unit tests con el builder `@angular/build:unit-test`
  (basado en **Vitest**, entorno jsdom). Correr headless:
  `ng test --watch=false`.
- `ng generate component <name>` → componente standalone, estilos SCSS.

No hay e2e ni script de lint configurados.

## Testing

- Specs junto al código (`*.spec.ts`), `TestBed.configureTestingModule({...})`.
- En jsdom **no existe `AFRAME`**: `registerArCardComponents()` es no-op y las
  escenas A-Frame no se inicializan — los tests de `ArViewer` solo verifican que
  el componente se crea.
