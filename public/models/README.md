# Modelo 3D del visor AR

`ArViewer` (`src/app/ar-viewer/ar-viewer.html`) carga un modelo glTF binario desde:

```
public/models/model.glb
```

**No está incluido** — hay que agregarlo.

## Requisitos del archivo

- Formato `.glb` (glTF binario, todo en un solo archivo: geometría, texturas y animaciones). Si solo tenés `.gltf` + `.bin` + texturas sueltas, o los copiás todos a esta carpeta y cambiás el `src` del `<a-asset-item>` al `.gltf`, o los convertís a `.glb` (por ejemplo con [gltf-pipeline](https://github.com/CesiumGS/gltf-pipeline) o exportando directo como `.glb` desde Blender).
- Para que se reproduzca la animación automáticamente (`animation-mixer="loop: repeat"` en el template), el archivo debe tener al menos un clip de animación embebido (en Blender: exportar con "Include > Animation" activado).

## Ajustar posición/escala/rotación

Los modelos exportados vienen en escalas y orígenes muy distintos. En `ar-viewer.html`, el `<a-gltf-model>` arranca con `scale="0.05 0.05 0.05"` y `position="0 0 0"` como punto de partida razonable, pero casi siempre hay que afinarlo:

1. Corré `npm start` y abrí la app.
2. Abrí el inspector de A-Frame con `Ctrl+Alt+I` (funciona aunque MindAR no esté trackeando).
3. Seleccioná la entidad del modelo y ajustá `position`, `rotation` y `scale` visualmente.
4. Copiá los valores finales al template.

Si el modelo no aparece, revisá la consola del navegador: un 404 en `models/model.glb` significa que el archivo no está en esta carpeta con ese nombre.
