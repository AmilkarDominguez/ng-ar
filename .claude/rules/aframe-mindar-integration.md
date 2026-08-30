# Regla: integración A-Frame + MindAR en Angular

## Son librerías de script global, no imports npm

- Se cargan vía `angular.json` → `architect.build.options.scripts`, **no** con
  `import` en TS:
  ```
  "node_modules/aframe/dist/aframe-master.min.js",
  "node_modules/mind-ar/dist/mindar-image-aframe.prod.js"
  ```
- **El orden importa**: `aframe-master.min.js` antes que
  `mindar-image-aframe.prod.js`. MindAR se registra sobre el objeto global
  `AFRAME` al cargarse; si A-Frame no está primero, revienta.
- En runtime `AFRAME` es un global sin tipos first-party. Cualquier tipado se
  hace a mano (`declare const AFRAME: ... | undefined`) y siempre guardado con
  `typeof AFRAME !== 'undefined'` (no existe en SSR ni en jsdom/tests).

## Custom elements y change detection

- `<a-scene>`, `<a-entity>`, `<a-plane>`, los atributos `mindar-image` /
  `mindar-image-target`, etc. son custom elements que viven **fuera** de la
  change detection de Angular.
- Por eso `ArViewer` declara `schemas: [CUSTOM_ELEMENTS_SCHEMA]` en vez de
  importar clases de componente.
- Con `CUSTOM_ELEMENTS_SCHEMA`, los **property bindings** (`[foo]="..."`) fallan
  en silencio sobre custom elements. Usar siempre **attribute bindings**
  (`[attr.foo]="..."`) o interpolación (`foo="{{ ... }}"`).

## Timing: registrar componentes A-Frame antes de `<a-scene>`

- A-Frame parsea los atributos de cada entidad **cuando el elemento se monta en
  el DOM** (`connectedCallback`). Un componente custom referenciado por un
  atributo debe estar registrado **antes** de que Angular cree `<a-scene>`.
- Patrón usado: `registerArCardComponents()` (idempotente, con guard de `AFRAME`)
  se llama desde el **constructor** de `ArViewer`, que corre antes del render del
  template. No usar `afterNextRender`/`ngAfterViewInit` para esto (ya es tarde).
- Corolario para datos dinámicos: setear el contenido (ver
  [ar-card-scene.md](ar-card-scene.md)) **antes** de que el componente renderice
  (p. ej. desde un route resolver). A-Frame no reacciona a cambios de atributo
  en vivo salvo que el componente A-Frame implemente `update()`.

## CSR-only, cámara y DOM directo

- La app no tiene `@angular/ssr`: es 100% client-side render. No hay hydration ni
  guard de servidor que considerar.
- MindAR/A-Frame manipulan el DOM directamente y piden `navigator.mediaDevices`
  (cámara) al iniciar la escena → requiere HTTPS o `localhost`, y permiso del
  usuario.

## Budgets de producción

- `angular.json` sube los budgets `initial` (warning 4MB / error 6MB) a propósito:
  `aframe` + `mind-ar` + `three` pesan ~3MB juntos. **No** volver a bajarlos.
- `mind-ar` se instaló con `npm install --ignore-scripts` porque su dependencia
  `canvas` (solo la usa el compilador de targets Node, no el runtime browser)
  necesita build tools nativos. Nada en la app importa `canvas`.
