import { TestBed, inject } from '@angular/core/testing';

import { CallerResolverService } from './caller-resolver.service';

describe('CallerResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CallerResolverService]
    });
  });

  it('should be created', inject([CallerResolverService], (service: CallerResolverService) => {
    expect(service).toBeTruthy();
  }));
});
