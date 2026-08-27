import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';

import { ArCardDataService } from './ar-card-data';
import { registerArCardComponents } from './ar-aframe-components';

@Component({
  selector: 'app-ar-viewer',
  imports: [],
  templateUrl: './ar-viewer.html',
  styleUrl: './ar-viewer.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ArViewer {
  private readonly cardDataService = inject(ArCardDataService);

  /**
   * Card content rendered into the A-Frame scene. Swap it per person via
   * `ArCardDataService` before this component renders.
   */
  protected readonly cardData = this.cardDataService.card;

  /** Toggled by the marker's `targetFound` / `targetLost` events; drives the hint. */
  protected readonly targetFound = signal(false);

  private readonly targetEntity = viewChild<ElementRef<HTMLElement>>('targetEntity');

  constructor() {
    // A-Frame custom elements must be registered before <a-scene> is attached.
    registerArCardComponents();

    afterNextRender(() => {
      const entity = this.targetEntity()?.nativeElement;
      entity?.addEventListener('targetFound', () => this.targetFound.set(true));
      entity?.addEventListener('targetLost', () => this.targetFound.set(false));
    });
  }
}
