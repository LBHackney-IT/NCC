import { TestBed, inject } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';

import { CallRevisionService } from './call-revision.service';

let httpClientSpy: { get: jasmine.Spy };
let CallRevision: CallRevisionService;

describe('CallRevisionService', () => {
    beforeEach(() => {
        // from the Angular tutorial: https://angular.io/guide/testing#testing-http-services
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
        CallRevision = new CallRevisionService(<any>httpClientSpy);
    });

    it('should be created', () => {
        expect(CallRevision).toBeTruthy();
    }));
});
