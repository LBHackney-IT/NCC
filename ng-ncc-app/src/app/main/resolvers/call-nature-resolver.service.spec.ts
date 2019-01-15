import { TestBed, inject } from '@angular/core/testing';

import { CallNatureResolverService } from './call-nature-resolver.service';

describe('CallNatureResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CallNatureResolverService]
    });
  });

  it('should be created', inject([CallNatureResolverService], (service: CallNatureResolverService) => {
    expect(service).toBeTruthy();
  }));
});
