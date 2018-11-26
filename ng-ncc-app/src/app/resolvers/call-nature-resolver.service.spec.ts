import { TestBed, inject } from '@angular/core/testing';

import { CallNatureResolver } from './call-nature-resolver.service';

describe('CallNatureResolver', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CallNatureResolver]
        });
    });

    it('should be created', inject([CallNatureResolver], (service: CallNatureResolver) => {
        expect(service).toBeTruthy();
    }));
});
