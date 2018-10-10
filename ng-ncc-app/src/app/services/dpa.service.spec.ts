import { TestBed } from '@angular/core/testing';

import { DPAService } from './dpa.service';

describe('DPAService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DPAService = TestBed.get(DPAService);
    expect(service).toBeTruthy();
  });
});
