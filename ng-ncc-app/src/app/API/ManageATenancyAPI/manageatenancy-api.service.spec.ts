import { TestBed, inject } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';

import { ManageATenancyAPIService } from './manageatenancy-api.service';

let httpClientSpy: { get: jasmine.Spy };
let ManageATenancyAPI: ManageATenancyAPIService;


describe('ManageATenancyAPIService', () => {
    beforeEach(() => {
        // from the Angular tutorial: https://angular.io/guide/testing#testing-http-services
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
        ManageATenancyAPI = new ManageATenancyAPIService(<any>httpClientSpy);
    });

    it('should be created', () => {
        expect(ManageATenancyAPI).toBeTruthy();
    }));
});
