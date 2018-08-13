import { TestBed, inject } from '@angular/core/testing';

import { NotifyTemplatesService } from './notify-templates.service';

describe('NotifyTemplatesResolver', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [NotifyTemplatesService]
        });
    });

    it('should be created', inject([NotifyTemplatesService], (service: NotifyTemplatesResolver) => {
        expect(service).toBeTruthy();
    }));
});
