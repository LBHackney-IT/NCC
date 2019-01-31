import { TestBed, inject } from '@angular/core/testing';

import { AccountDetailsResolver } from './account-details-resolver.service';

describe('AccountDetailsResolver', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [AccountDetailsResolver]
        });
    });

    it('should be created', inject([AccountDetailsResolver], (service: AccountDetailsResolver) => {
        expect(service).toBeTruthy();
    }));
});
