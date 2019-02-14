import { TestBed } from '@angular/core/testing';

import { NextPaymentService } from './next-payment.service';

describe('NextPaymentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NextPaymentService = TestBed.get(NextPaymentService);
    expect(service).toBeTruthy();
  });
});
