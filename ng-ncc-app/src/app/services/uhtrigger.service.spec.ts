import { TestBed, inject } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';

import { UHTriggerService } from './uhtrigger.service';

let httpClientSpy: { get: jasmine.Spy };
let UHTrigger: UHTriggerService;

describe('UHTriggerService', () => {
    beforeEach(() => {
        // from the Angular tutorial: https://angular.io/guide/testing#testing-http-services
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
        UHTrigger = new UHTriggerService(<any>httpClientSpy);
    });

    it('should be created', () => {
        expect(UHTrigger).toBeTruthy();
    }));
});
