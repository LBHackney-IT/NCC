import { TestBed, inject } from '@angular/core/testing';

import { CallService } from './call.service';

describe('CallService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CallService]
        });
    });

    it('should be created', inject([CallService], (service: CallService) => {
        expect(service).toBeTruthy();
    }));
});
