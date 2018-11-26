import { TestBed, inject } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';

import { AuthService } from './auth.service';

let httpClientSpy: { get: jasmine.Spy };
let Auth: AuthService;

describe('AuthService', () => {
    beforeEach(() => {
        // from the Angular tutorial: https://angular.io/guide/testing#testing-http-services
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
        Auth = new AuthService(<any>httpClientSpy);
    });

    it('should be created', () => {
        expect(Auth).toBeTruthy();
    }));
});
