import { TestBed, inject } from '@angular/core/testing';

import { ContactDetailsResolver } from './contact-details-resolver.service';

describe('ContactDetailsResolver', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ContactDetailsResolver]
        });
    });

    it('should be created', inject([ContactDetailsResolver], (service: ContactDetailsResolver) => {
        expect(service).toBeTruthy();
    }));
});
