import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ArViewer } from './ar-viewer';

describe('ArViewer', () => {
  let component: ArViewer;
  let fixture: ComponentFixture<ArViewer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArViewer],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ArViewer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
