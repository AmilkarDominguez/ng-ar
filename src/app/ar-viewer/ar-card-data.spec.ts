import { TestBed } from '@angular/core/testing';

import { ArCardDataService } from './ar-card-data';

describe('ArCardDataService', () => {
  let service: ArCardDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArCardDataService);
  });

  it('exposes a default card', () => {
    expect(service.card().name).toBeTruthy();
    expect(service.card().links.length).toBeGreaterThan(0);
  });

  it('replaces the card with setCard()', () => {
    service.setCard({
      name: 'Ada Lovelace',
      role: 'Analyst',
      company: 'Analytical Engine Co.',
      avatar: 'ar/avatar.png',
      accentColor: '#ff00aa',
      textColor: '#ffffff',
      links: [{ id: 'web', icon: 'ar/icon-web.png', url: 'https://example.org' }],
    });

    expect(service.card().name).toBe('Ada Lovelace');
    expect(service.card().links).toHaveLength(1);
  });

  it('merges partial updates with patch()', () => {
    const before = service.card();
    service.patch({ role: 'Principal Engineer' });

    expect(service.card().role).toBe('Principal Engineer');
    expect(service.card().name).toBe(before.name);
    expect(service.card().links).toBe(before.links);
  });
});
