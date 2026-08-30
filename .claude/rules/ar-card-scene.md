# Regla: escena "tarjeta AR" (`src/app/ar-viewer/`)

La escena es una **AR business card**: una composición de `<a-plane>` 2D
animados (+ un `<a-box>` decorativo) que se superpone sobre el marcador cuando
MindAR lo detecta. **No se usa `.glb`** — el `<a-gltf-model>` original se quitó
(`public/models/` quedó huérfano, borrable).

## Archivos

| Archivo | Rol |
|---|---|
| `ar-viewer.ts` | Componente standalone. Inyecta `ArCardDataService`, llama `registerArCardComponents()` en el constructor, expone `cardData` (signal) y `targetFound` (signal para el hint) |
| `ar-viewer.html` | La escena A-Frame, data-driven vía `@let card = cardData()` + `[attr.*]` |
| `ar-viewer.scss` | `:host` full-bleed fixed; estilos del `.hint` |
| `ar-card-data.ts` | `ArCardDataService` + interfaces `ArCardData` / `ArSocialLink` |
| `ar-aframe-components.ts` | `registerArCardComponents()` — registra los componentes A-Frame custom |

## Datos dinámicos: `ArCardDataService`

- `providedIn: 'root'`. Guarda un `signal<ArCardData>` con datos por defecto.
- API: `card` (readonly signal), `setCard(card)`, `patch(partial)`.
- `ArCardData`: `name`, `role`, `company`, `avatar` (ruta PNG en `public/`),
  `avatarVideo?` (WebM alpha opcional), `accentColor`, `textColor`, `links[]`.
- `ArSocialLink`: `id` (string), `icon` (ruta), `url`. **El `url` no debe contener
  `;`** — rompe el parser de atributos de A-Frame (`social-link="<url>"`).
- Como A-Frame lee atributos al montar, **cambiar la card antes del render**
  (route resolver / `APP_INITIALIZER`), no en vivo. Ver
  [aframe-mindar-integration.md](aframe-mindar-integration.md).

## Componentes A-Frame custom (`ar-aframe-components.ts`)

`registerArCardComponents()` es idempotente y no-op sin `AFRAME`. Registra:

- **`social-link="<url>"`** — al `click`/tap abre la URL en pestaña nueva
  (`window.open(url, '_blank', 'noopener,noreferrer')`). Se auto-agrega la clase
  `.clickable` para que la detecte el raycaster de la cámara.
- **`card-orchestrator`** — va en la entidad `mindar-image-target`. En cada
  `targetFound` re-emite el evento `card:enter` sobre **cada descendiente
  `[data-entrance]`**, de modo que las animaciones de entrada y los loops se
  vuelven a reproducir en cada escaneo (no solo la primera vez).

## Interactividad

- La `<a-camera>` lleva `cursor="fuse: false; rayOrigin: mouse"` +
  `raycaster="objects: .clickable; far: 10000"`.
- Feedback hover/tap: cada ícono tiene `animation__hover` /`animation__unhover`
  (scale 1 ↔ 1.25) con `startEvents: mouseenter` / `mouseleave`.

## Convención de animaciones (IMPORTANTE al editar el template)

1. Todo elemento animado lleva el atributo `data-entrance`.
2. Sus `animation__*` quedan **pausadas** con `startEvents: card:enter` (no
   autoplay). Las dispara `card-orchestrator`.
3. El **estado visual inicial** (scale / opacity en los atributos) se setea al
   valor `from` de la animación, para que no haya flash antes del `card:enter`.
4. **Máximo una animación por propiedad por elemento.** Animar la misma
   propiedad dos veces (p. ej. `material.opacity` en dos `animation__*`) genera
   glitches en A-Frame.
   - Excepción intencional: los íconos `.clickable` animan `scale` en
     `__in` / `__hover` / `__unhover`, pero con triggers que no se solapan.
5. Entrada escalonada con `delay` incremental (0 / 200 / 350 / 450 / 550 /
   `650 + i*90` ms). Easings: `easeOutElastic` (panel), `easeOutBack` (pop-in),
   `easeOutCubic` (slides). Loops ambientales: `__pulse` (opacity), `__spin`
   (rotation), `__float` (position con `dir: alternate; loop: true`).
6. Mantener **< 15 planos** en total (hoy ~13) por rendimiento móvil.

## Texto

- Nombre / cargo se renderizan con `<a-text>` (atributo `text` completo por
  binding, con `opacity: 0` inicial + `animation__fade` sobre `text.opacity`).
- `<a-text>` baja la fuente Roboto MSDF de `cdn.aframe.io` en runtime (necesita
  red la primera vez). Para offline: `font="<url-msdf-propia>"` o reemplazar por
  texturas prerenderizadas.

## Eventos del marcador

`ArViewer` escucha `targetFound` / `targetLost` en la entidad
`#targetEntity` (dentro de `afterNextRender`) y togglea el signal `targetFound`
que controla la clase `.hidden` del `.hint` en pantalla.
