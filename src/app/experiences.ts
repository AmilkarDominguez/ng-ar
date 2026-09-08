/**
 * Registry of AR test experiences shown on the home menu.
 *
 * Add a new entry here + a lazy route in `app.routes.ts` (matching `path`) to
 * surface another option. `available: false` renders the card disabled so
 * work-in-progress experiments can be listed without a working route.
 */
export interface Experience {
  /** Stable id, also used as a testing hook. */
  readonly id: string;
  /** Route path (no leading slash), matched against `app.routes.ts`. */
  readonly path: string;
  readonly title: string;
  readonly description: string;
  /** Emoji shown on the card. */
  readonly icon: string;
  /** Short tag rendered as a badge (e.g. the underlying tech). */
  readonly badge: string;
  /** When false the card is shown but not navigable. */
  readonly available: boolean;
}

export const EXPERIENCES: readonly Experience[] = [
  {
    id: 'mindar',
    path: 'mindar',
    title: 'MindAR · tarjeta AR',
    description:
      'Image tracking con MindAR + A-Frame. Apunta la cámara al marcador impreso para ver la tarjeta animada.',
    icon: '🎯',
    badge: 'MindAR + A-Frame',
    available: true,
  },
  {
    id: 'ios-quick-look',
    path: 'ios-quick-look',
    title: 'iOS · AR Quick Look',
    description:
      'AR nativo de iOS (Safari). Lanza el visor Quick Look del sistema con un modelo USDZ. Solo funciona en iPhone/iPad.',
    icon: '',
    badge: 'USDZ nativo',
    available: true,
  },
];
