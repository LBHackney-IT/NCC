import { TestBed } from '@angular/core/testing';

import { BackLinkService } from './back-link.service';

describe('BackLinkService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BackLinkService = TestBed.get(BackLinkService);
    expect(service).toBeTruthy();
  });
});
