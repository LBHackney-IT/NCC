import { TestBed, inject } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';

import { NCCAPIService } from './ncc-api.service';

let httpClientSpy: { get: jasmine.Spy };
let NCCAPI: NCCAPIService;

describe('NCCAPIService', () => {
    beforeEach(() => {
        // from the Angular tutorial: https://angular.io/guide/testing#testing-http-services
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
        NCCAPI = new NCCAPIService(<any>httpClientSpy);
    });

    it('should be created', () => {
        expect(NCCAPI).toBeTruthy();
    }));
});
