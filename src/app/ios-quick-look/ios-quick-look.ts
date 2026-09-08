import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Native iOS AR Quick Look launcher.
 *
 * On iOS Safari an `<a rel="ar" href="*.usdz">` opens the system AR viewer
 * directly — no A-Frame/MindAR, no camera permission prompt from the page.
 * Everywhere else the link just downloads the model, so we show a note.
 *
 * Requires `public/models/model.usdz` (USDZ, not GLB — Quick Look only reads
 * USDZ/`.reality`). Convert a `.glb` with Apple's Reality Converter or
 * `usd_from_gltf`. Without the file the link 404s.
 */
@Component({
  selector: 'app-ios-quick-look',
  imports: [RouterLink],
  templateUrl: './ios-quick-look.html',
  styleUrl: './ios-quick-look.scss',
})
export class IosQuickLook {
  /** Path (relative to base href) of the USDZ asset served from `public/`. */
  protected readonly modelSrc = 'models/model.usdz';

  /** True on iPhone/iPad — the only place Quick Look actually launches. */
  protected readonly isIos = signal(this.detectIos());

  private detectIos(): boolean {
    if (typeof navigator === 'undefined') {
      return false;
    }
    const ua = navigator.userAgent;
    const iOsDevice = /iPad|iPhone|iPod/.test(ua);
    // iPadOS 13+ reports as a Mac; disambiguate via touch support.
    const iPadOs = ua.includes('Macintosh') && navigator.maxTouchPoints > 1;
    return iOsDevice || iPadOs;
  }
}
