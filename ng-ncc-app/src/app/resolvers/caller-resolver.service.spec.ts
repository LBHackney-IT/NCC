import { TestBed, inject } from '@angular/core/testing';

import { CallerResolver } from './caller-resolver.service';

describe('CallerResolver', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CallerResolver]
        });
    });

    it('should be created', inject([CallerResolver], (service: CallerResolver) => {
        expect(service).toBeTruthy();
    }));
});
