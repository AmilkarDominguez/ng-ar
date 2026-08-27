/**
 * Custom A-Frame components for the AR business card.
 *
 * A-Frame + MindAR are loaded as global scripts (see `angular.json` -> the
 * `scripts` array), so `AFRAME` is a runtime global with no first-party types.
 * These components must be registered *before* the `<a-scene>` element is
 * attached to the DOM, so `ArViewer` calls `registerArCardComponents()` from its
 * constructor (which runs before the template renders).
 */

interface AframeEntity extends HTMLElement {
  emit(name: string, detail?: unknown, propagate?: boolean): void;
  querySelectorAll(selectors: string): NodeListOf<AframeEntity>;
  object3D: { visible: boolean };
}

interface AframeComponent {
  el: AframeEntity;
  data: unknown;
}

interface AframeComponentDefinition {
  schema?: Record<string, unknown>;
  init?(this: AframeComponent): void;
  remove?(this: AframeComponent): void;
}

interface AframeGlobal {
  registerComponent(name: string, definition: AframeComponentDefinition): void;
  components: Record<string, unknown>;
}

declare const AFRAME: AframeGlobal | undefined;

let registered = false;

/** Idempotent; a no-op when A-Frame is not on the page (SSR / unit tests). */
export function registerArCardComponents(): void {
  if (registered || typeof AFRAME === 'undefined') {
    return;
  }
  registered = true;

  /**
   * `social-link="<url>"` — opens the URL in a new tab when the plane is
   * clicked/tapped. Relies on the camera's `cursor` + `raycaster="objects: .clickable"`;
   * the component tags itself `.clickable` so the template doesn't have to.
   */
  if (!AFRAME.components['social-link']) {
    AFRAME.registerComponent('social-link', {
      schema: { type: 'string' },
      init(this: AframeComponent) {
        this.el.classList.add('clickable');
        this.el.addEventListener('click', () => {
          const url = this.data as string;
          if (url) {
            window.open(url, '_blank', 'noopener,noreferrer');
          }
        });
      },
    });
  }

  /**
   * `card-orchestrator` — sits on the `mindar-image-target` entity. Every time
   * the marker is (re)detected it replays the staggered entrance animations of
   * every `[data-entrance]` descendant by re-emitting their `card:enter` start
   * event, so the scene animates in fresh on each scan instead of only once.
   */
  if (!AFRAME.components['card-orchestrator']) {
    AFRAME.registerComponent('card-orchestrator', {
      init(this: AframeComponent) {
        this.el.addEventListener('targetFound', () => {
          this.el.querySelectorAll('[data-entrance]').forEach((child) => {
            child.emit('card:enter');
          });
        });
      },
    });
  }
}
