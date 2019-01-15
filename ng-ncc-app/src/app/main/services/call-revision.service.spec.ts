import { TestBed } from '@angular/core/testing';

import { CallRevisionService } from './call-revision.service';

describe('CallRevisionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CallRevisionService = TestBed.get(CallRevisionService);
    expect(service).toBeTruthy();
  });
});
