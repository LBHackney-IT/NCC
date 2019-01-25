import { TestBed } from '@angular/core/testing';

import { UHTriggerService } from './uhtrigger.service';

describe('UHTriggerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UHTriggerService = TestBed.get(UHTriggerService);
    expect(service).toBeTruthy();
  });
});
