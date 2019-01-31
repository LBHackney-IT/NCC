import { TestBed, inject } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';

import { BackLinkService } from './back-link.service';

let httpClientSpy: { get: jasmine.Spy };
let BackLink: BackLinkService;

describe('BackLinkService', () => {
    beforeEach(() => {
        // from the Angular tutorial: https://angular.io/guide/testing#testing-http-services
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
        BackLink = new BackLinkService(<any>httpClientSpy);
    });

    it('should be created', () => {
        expect(BackLink).toBeTruthy();
    });
});
