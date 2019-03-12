import { TestBed } from '@angular/core/testing';

import { CallbackService } from './callback.service';

describe('CallbackService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CallbackService = TestBed.get(CallbackService);
    expect(service).toBeTruthy();
  });
});
