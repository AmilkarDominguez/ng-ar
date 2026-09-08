# Modelos 3D

## `model.usdz` — prueba "iOS · AR Quick Look" (`/ios-quick-look`)

`IosQuickLook` (`src/app/ios-quick-look/`) lanza el visor AR nativo de iOS con:

```
public/models/model.usdz
```

**No está incluido** — hay que agregarlo.

### Requisitos

- Formato **USDZ** (o `.reality`). Quick Look **no** lee `.glb`/`.gltf`.
- Convertir un `.glb`/`.gltf` con [Reality Converter](https://developer.apple.com/augmented-reality/tools/) (macOS)
  o [`usd_from_gltf`](https://github.com/google/usd_from_gltf).
- Se sirve como estático desde `public/`; la ruta en el componente es
  `models/model.usdz` (relativa al base href).

### Cómo probar

Solo funciona en **Safari de iPhone/iPad**. En otros navegadores el enlace
`<a rel="ar">` descarga el archivo en vez de abrir el visor — el componente
muestra un aviso cuando detecta que no es iOS.

## `model.glb`

Ya **no** se usa en la escena MindAR (`ArViewer` es 100% `<a-plane>` 2D, sin
`<a-gltf-model>`). Queda como fuente para generar el `.usdz` de arriba.
