import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { IosQuickLook } from './ios-quick-look';

describe('IosQuickLook', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IosQuickLook],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(IosQuickLook);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('exposes an rel="ar" launch link', () => {
    const fixture = TestBed.createComponent(IosQuickLook);
    fixture.detectChanges();
    const link = fixture.nativeElement.querySelector('a[rel="ar"]');
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toContain('.usdz');
  });
});
