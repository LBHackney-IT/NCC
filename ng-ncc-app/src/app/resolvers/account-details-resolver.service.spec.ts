import { TestBed, inject } from '@angular/core/testing';

import { IAccountDetailsResolver } from './account-details-resolver.service';

describe('IAccountDetailsResolver', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [IAccountDetailsResolver]
        });
    });

    it('should be created', inject([IAccountDetailsResolver], (service: IAccountDetailsResolver) => {
        expect(service).toBeTruthy();
    }));
});
