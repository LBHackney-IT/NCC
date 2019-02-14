import { TestBed } from '@angular/core/testing';

import { ViewOnlyService } from './view-only.service';

describe('ViewOnlyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ViewOnlyService = TestBed.get(ViewOnlyService);
    expect(service).toBeTruthy();
  });
});
