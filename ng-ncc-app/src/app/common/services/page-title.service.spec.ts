import { TestBed, inject } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';

import { PageTitleService } from './page-title.service';

let httpClientSpy: { get: jasmine.Spy };
let PageTitle: PageTitleService;

describe('PageTitleService', () => {
    beforeEach(() => {
        // from the Angular tutorial: https://angular.io/guide/testing#testing-http-services
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
        PageTitle = new PageTitleService(<any>httpClientSpy);
    });

    it('should be created', () => {
        expect(PageTitle).toBeTruthy();
    });
});
