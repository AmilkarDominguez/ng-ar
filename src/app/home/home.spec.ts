import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { EXPERIENCES } from '../experiences';
import { Home } from './home';

describe('Home', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Home);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders a card per experience', () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    const cards = fixture.nativeElement.querySelectorAll('.card');
    expect(cards.length).toBe(EXPERIENCES.length);
  });
});
