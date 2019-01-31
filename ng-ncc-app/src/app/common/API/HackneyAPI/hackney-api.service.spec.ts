import { TestBed, inject } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';

import { HackneyAPIService } from './hackney-api.service';

let httpClientSpy: { get: jasmine.Spy };
let HackneyAPI: HackneyAPIService;

describe('HackneyAPIService', () => {
    beforeEach(() => {
        // from the Angular tutorial: https://angular.io/guide/testing#testing-http-services
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
        HackneyAPI = new HackneyAPIService(<any>httpClientSpy);
    });

    it('should be created', () => {
        expect(HackneyAPI).toBeTruthy();
    });

});
