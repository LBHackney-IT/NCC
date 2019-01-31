import { TestBed, inject } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';

import { DPAService } from './dpa.service';

let httpClientSpy: { get: jasmine.Spy };
let DPA: DPAService;

describe('DPAService', () => {
    beforeEach(() => {
        // from the Angular tutorial: https://angular.io/guide/testing#testing-http-services
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
        DPA = new DPAService(<any>httpClientSpy);
    });

    it('should be created', () => {
        expect(DPA).toBeTruthy();
    });
});
