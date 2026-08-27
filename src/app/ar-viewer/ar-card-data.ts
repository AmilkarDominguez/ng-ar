import { Injectable, signal } from '@angular/core';

/**
 * A single clickable social/contact icon rendered as an <a-plane> over the card.
 * `icon` and `url` are consumed verbatim by the A-Frame template / `social-link`
 * component, so keep `url` free of `;` (it breaks the A-Frame attribute parser).
 */
export interface ArSocialLink {
  readonly id: string;
  /** Texture path, served from `public/` (e.g. `ar/icon-wa.png`). */
  readonly icon: string;
  /** Destination opened in a new tab on tap. `https:`, `mailto:`, `tel:` … */
  readonly url: string;
}

/** Everything the AR business-card scene needs to render one person. */
export interface ArCardData {
  readonly name: string;
  readonly role: string;
  readonly company: string;
  /** Avatar texture path served from `public/` (transparent PNG, ~512²). */
  readonly avatar: string;
  /** Optional alpha WebM shown instead of the still avatar. */
  readonly avatarVideo?: string;
  /** HUD accent colour (hex), used for secondary text + the decorative cube. */
  readonly accentColor: string;
  /** Primary text colour (hex). */
  readonly textColor: string;
  readonly links: readonly ArSocialLink[];
}

const DEFAULT_CARD: ArCardData = {
  name: 'Amilkar Dominguez',
  role: 'Full-Stack Developer',
  company: 'ng-ar labs',
  avatar: 'ar/avatar.png',
  accentColor: '#00FFCC',
  textColor: '#FFFFFF',
  links: [
    { id: 'whatsapp', icon: 'ar/icon-wa.png', url: 'https://wa.me/00000000000' },
    { id: 'linkedin', icon: 'ar/icon-li.png', url: 'https://www.linkedin.com/in/your-profile' },
    { id: 'email', icon: 'ar/icon-email.png', url: 'mailto:you@example.com' },
    { id: 'web', icon: 'ar/icon-web.png', url: 'https://example.com' },
  ],
};

/**
 * Provides the data for the AR card as a signal so the same scene can be reused
 * for different people. `ArViewer` reads `card()` into the A-Frame template;
 * because A-Frame parses element attributes when the `<a-scene>` is attached,
 * set the card via `setCard()` / `patch()` *before* the component renders
 * (e.g. from a route resolver) rather than mutating it live.
 */
@Injectable({ providedIn: 'root' })
export class ArCardDataService {
  private readonly _card = signal<ArCardData>(DEFAULT_CARD);

  /** Read-only view consumed by the AR scene. */
  readonly card = this._card.asReadonly();

  setCard(card: ArCardData): void {
    this._card.set(card);
  }

  patch(partial: Partial<ArCardData>): void {
    this._card.update((current) => ({ ...current, ...partial }));
  }
}
