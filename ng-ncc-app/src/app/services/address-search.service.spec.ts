import { TestBed, inject } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';

import { AddressSearchService } from './address-search.service';

let httpClientSpy: { get: jasmine.Spy };
let AddressSearch: AddressSearchService;

describe('AddressSearchService', () => {
    beforeEach(() => {
        // from the Angular tutorial: https://angular.io/guide/testing#testing-http-services
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
        AddressSearch = new AddressSearchService(<any>httpClientSpy);
    });

    it('should be created', () => {
        expect(AddressSearch).toBeTruthy();
    });
});
