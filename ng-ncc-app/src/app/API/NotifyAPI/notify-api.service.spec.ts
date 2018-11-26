import { TestBed, inject } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';

import { NotifyAPIService } from './notify-api.service';

let httpClientSpy: { get: jasmine.Spy };
let NotifyAPI: NotifyAPIService;

describe('NotifyAPIService', () => {
    beforeEach(() => {
        // from the Angular tutorial: https://angular.io/guide/testing#testing-http-services
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
        NotifyAPI = new NotifyAPIService(<any>httpClientSpy);
    });

    it('should be created', () => {
        expect(NotifyAPI).toBeTruthy();
    }));
});
