# Marcadores de MindAR

Esta carpeta debe contener el archivo que usa `ArViewer` (`src/app/ar-viewer/ar-viewer.html`) para el seguimiento de imagen:

- `targets.mind` — archivo binario compilado que MindAR usa para reconocer la(s) imagen(es) marcador. **No está incluido**, hay que generarlo.

(El modelo 3D que se muestra al detectar el marcador vive aparte, en `public/models/` — ver `public/models/README.md`.)

## Cómo generar `targets.mind`

1. Elige una imagen con buen contraste y detalle (evita patrones repetitivos o superficies lisas). Es la misma imagen que después vas a imprimir/mostrar como marcador físico.
2. Compílala con la herramienta oficial de MindAR: https://hiukim.github.io/mind-ar-js-doc/tools/compile
3. Descarga el `.mind` resultante y colócalo aquí como `targets/targets.mind`.

Si `targets.mind` no existe, la escena carga igualmente pero MindAR no podrá iniciar el seguimiento (verás un error de red en la consola al pedir el archivo).

Para varios marcadores, compílalos juntos en un solo `.mind` y usa `targetIndex` en cada `<a-entity mindar-image-target>` para asociar el contenido 3D al marcador correspondiente (0, 1, 2, ...).
