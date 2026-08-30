# Regla: assets de la tarjeta AR e image target

## Estáticos: `public/`, no `src/assets/`

Este proyecto (Angular 21 CLI) sirve estáticos desde `public/` (config
`assets` en `angular.json`). **No existe `src/assets/`.** En la escena A-Frame
las rutas son relativas al base href: `ar/panel-bg.png`, `targets/targets.mind`,
etc.

## Texturas de la escena: `public/ar/`

Archivos que espera `ar-viewer.html`:

| Archivo | Tamaño final | Uso |
|---|---|---|
| `panel-bg.png` | 1024² | Panel principal |
| `glow.png` | 512² | Resplandor radial detrás del panel |
| `avatar.png` | 512² | Foto / avatar (o `avatarVideo` WebM alpha) |
| `name-plate.png` | 512×128 | Placa del nombre |
| `progress-bar.png` | 512×64 | Barra HUD |
| `hud-element-1.png` / `hud-element-2.png` | 256² | Anillos decorativos (giran en loop) |
| `icon-<link.id>.png` (`wa`, `li`, `email`, `web`, …) | 128² | Íconos sociales clicables |

El sufijo de los íconos sale de `link.id` en `ArCardDataService`. Si agregás un
link, nombrá el PNG `icon-<id>.png` o apuntá `link.icon` a la ruta que quieras.

## Placeholders

Los PNG commiteados en `public/ar/` son **placeholders** generados por
[`scripts/generate-ar-placeholders.ps1`](../../scripts/generate-ar-placeholders.ps1)
(Windows PowerShell 5.1 + `System.Drawing`/GDI+, sin deps npm). Dibujan formas
HUD cyan neón sobre fondo transparente. Regenerar:

```
powershell -ExecutionPolicy Bypass -File scripts/generate-ar-placeholders.ps1
```

Reemplazar cada uno por el arte definitivo **manteniendo el nombre**.

## Specs del arte final

- PNG con canal alpha real (no fondo blanco).
- Dimensiones potencia de 2 (256 / 512 / 1024) para mipmaps de WebGL.
- Comprimir (TinyPNG / `oxipng`), objetivo < 200 KB por archivo.
- No pasar de ~15 planos en total en la escena.

## Image target `public/targets/targets.mind`

- Archivo binario compilado que MindAR usa para reconocer el marcador.
  **No está commiteado**; sin él la escena carga pero el tracking 404ea.
- Generarlo con la herramienta oficial:
  https://hiukim.github.io/mind-ar-js-doc/tools/compile
  1. Diseñar la cara de la tarjeta con buen contraste y detalle no repetitivo.
  2. Compilar esa imagen → descargar `.mind`.
  3. Guardar como `public/targets/targets.mind` (o cambiar `imageTargetSrc` en
     `ar-viewer.html`).
  4. Imprimir/mostrar exactamente esa imagen como marcador físico.
- Varios marcadores: compilarlos juntos en un solo `.mind` y usar `targetIndex`
  en cada `<a-entity mindar-image-target>` (0, 1, 2, …).

Ver también `public/ar/README.md` y `public/targets/README.md`.
