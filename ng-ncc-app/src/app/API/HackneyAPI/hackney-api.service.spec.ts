import { TestBed, inject } from '@angular/core/testing';

import { HackneyAPIService } from './hackney-api.service';

describe('HackneyAPIService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HackneyAPIService]
    });
  });

  it('should be created', inject([HackneyAPIService], (service: HackneyAPIService) => {
    expect(service).toBeTruthy();
  }));
});
