import { TestBed, inject } from '@angular/core/testing';

import { ManageATenancyAPIService } from './manageatenancy-api.service';

describe('ManageATenancyAPIService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ManageATenancyAPIService]
        });
    });

    it('should be created', inject([ManageATenancyAPIService], (service: ManageATenancyAPIService) => {
        expect(service).toBeTruthy();
    }));
});
