# Reglas de contexto del proyecto (`.claude/rules/`)

Contexto de referencia para trabajar en este repo sin re-derivarlo cada sesión.
`CLAUDE.md` (raíz) importa estos archivos con `@.claude/rules/...` para que se
carguen automáticamente en el contexto de Claude Code.

| Archivo | Cubre |
|---|---|
| [aframe-mindar-integration.md](aframe-mindar-integration.md) | Cómo conviven A-Frame + MindAR (scripts globales) con Angular: orden de carga, `CUSTOM_ELEMENTS_SCHEMA`, timing de registro de componentes, CSR-only |
| [ar-card-scene.md](ar-card-scene.md) | Arquitectura de la escena "tarjeta AR": planos 2D, datos dinámicos vía servicio, componentes A-Frame custom, convención de animaciones de entrada |
| [assets-pipeline.md](assets-pipeline.md) | `public/ar/` (texturas), script de placeholders, specs de arte final, generación del image target `.mind` |
| [angular-conventions.md](angular-conventions.md) | Angular 21 standalone + signals, TS estricto, `public/` vs `src/assets`, testing con Vitest |

## Al modificar el proyecto

- Si cambia una decisión de arquitectura, actualizá el archivo de regla
  correspondiente en el mismo commit.
- Reglas nuevas: creá el `.md`, agregalo a esta tabla y a la lista de `@import`
  en `CLAUDE.md`.
