import {
  Component,
  ElementRef,
  CUSTOM_ELEMENTS_SCHEMA,
  afterNextRender,
  signal,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-ar-viewer',
  imports: [],
  templateUrl: './ar-viewer.html',
  styleUrl: './ar-viewer.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ArViewer {
  protected readonly targetFound = signal(false);

  private readonly targetEntity = viewChild<ElementRef<HTMLElement>>('targetEntity');

  constructor() {
    afterNextRender(() => {
      const entity = this.targetEntity()?.nativeElement;
      entity?.addEventListener('targetFound', () => this.targetFound.set(true));
      entity?.addEventListener('targetLost', () => this.targetFound.set(false));
    });
  }
}
