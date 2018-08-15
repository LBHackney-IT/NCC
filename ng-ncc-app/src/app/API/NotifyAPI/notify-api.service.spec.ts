import { TestBed, inject } from '@angular/core/testing';

import { NotifyAPIService } from './notify.service';

describe('NotifyAPIService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [NotifyAPIService]
        });
    });

    it('should be created', inject([NotifyAPIService], (service: NotifyAPIService) => {
        expect(service).toBeTruthy();
    }));
});
