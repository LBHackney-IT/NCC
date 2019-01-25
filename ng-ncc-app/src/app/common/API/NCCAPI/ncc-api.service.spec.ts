import { TestBed, inject } from '@angular/core/testing';

import { NCCAPIService } from './ncc-api.service';

describe('NCCAPIService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [NCCAPIService]
        });
    });

    it('should be created', inject([NCCAPIService], (service: NCCAPIService) => {
        expect(service).toBeTruthy();
    }));
});
