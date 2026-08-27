# Assets de la tarjeta AR (`public/ar/`)

Texturas 2D que `ArViewer` (`src/app/ar-viewer/`) superpone sobre la tarjeta
física cuando MindAR la detecta. Se sirven como estáticos desde `public/`, así
que en la escena A-Frame se referencian con rutas tipo `ar/panel-bg.png`.

## Archivos que espera la escena

| Archivo | Uso | Tamaño sugerido (final) |
|---|---|---|
| `panel-bg.png` | Panel principal (forma hexagonal/redondeada, borde glow neón, fondo oscuro semi-transparente) | 1024×1024 |
| `glow.png` | Resplandor radial muy transparente detrás del panel | 512×512 |
| `avatar.png` | Foto / avatar con fondo transparente | 512×512 |
| `name-plate.png` | Placa para el nombre (fondo semi-transparente + borde neón) | 512×128 |
| `progress-bar.png` | Barra horizontal estilo HUD | 512×64 |
| `hud-element-1.png` | Anillo decorativo (gira en loop) | 256×256 |
| `hud-element-2.png` | Anillo decorativo (gira en loop, sentido inverso) | 256×256 |
| `icon-wa.png` `icon-li.png` `icon-email.png` `icon-web.png` | Íconos sociales clicables | 128×128 |

Los `id` de la lista de íconos salen de `ArCardDataService` (`link.id`): si
agregás/renombrás un link, nombrá el PNG `icon-<id>.png` o apuntá `link.icon` a
la ruta que quieras.

## Placeholders

Los PNG incluidos son **placeholders** generados con GDI+ para que la escena
renderice de punta a punta antes de tener el arte final. Regeneralos con:

```
powershell -ExecutionPolicy Bypass -File scripts/generate-ar-placeholders.ps1
```

Reemplazá cada uno por el arte definitivo **manteniendo el nombre**.

## Preparar el arte final

- Exportá PNG con transparencia real (canal alpha), no fondo blanco.
- Dimensiones potencia de 2 (256, 512, 1024) para que WebGL genere mipmaps.
- Comprimí con TinyPNG / `oxipng` (objetivo < 200 KB por archivo).
- Mantené < 15 planos en total en la escena para buen rendimiento en móvil
  (hoy son ~13; contá los que agregues en `ar-viewer.html`).
- Avatar en video: poné un WebM con alpha en `public/ar/` y seteá
  `avatarVideo` en `ArCardDataService`; la escena usa `<video>` en vez del PNG.
- El nombre / cargo se renderizan con `<a-text>`, que baja la fuente Roboto MSDF
  desde `cdn.aframe.io` en runtime (necesita red la primera vez). Si necesitás
  que funcione 100% offline, generá un MSDF propio y agregá `font="<url>"` a los
  `<a-text>` en `ar-viewer.html`, o reemplazá el texto por texturas
  (`name-plate.png` prerenderizado con el nombre).

## Generar el image target (`targets/targets.mind`)

El marcador vive en `public/targets/` (ver `public/targets/README.md`). Para una
tarjeta de negocio:

1. Diseñá la cara de la tarjeta con buen contraste y detalle no repetitivo.
2. Compilá esa imagen en https://hiukim.github.io/mind-ar-js-doc/tools/compile
3. Guardá el resultado como `public/targets/targets.mind` (o cambiá
   `imageTargetSrc` en `ar-viewer.html`).
4. Imprimí/mostrá exactamente esa imagen como marcador físico.
