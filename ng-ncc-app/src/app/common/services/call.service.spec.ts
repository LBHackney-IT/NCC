import { TestBed, inject } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { CallService } from './call.service';
import { HackneyAPIService } from '../API/HackneyAPI/hackney-api.service';
import { ManageATenancyAPIService } from '../API/ManageATenancyAPI/manageatenancy-api.service';
import { NCCAPIService } from '../API/NCCAPI/ncc-api.service';
import { NotesService } from './notes.service';

let Call: CallService;
const AuthServiceSpy: jasmine.SpyObj<AuthService>;
const HackneyAPIServiceSpy: jasmine.SpyObj<HackneyAPIService>;
const ManageATenancyAPIServiceSpy: jasmine.SpyObj<ManageATenancyAPIService>;
const NCCAPIServiceSpy: jasmine.SpyObj<NCCAPIService>;
const NotesServiceSpy: jasmine.SpyObj<NotesService>;

describe('CallService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                AuthServiceSpy,
                HackneyAPIServiceSpy,
                ManageATenancyAPIServiceSpy,
                NCCAPIServiceSpy,
                NotesServiceSpy
            ]
        });

        // from the Angular tutorial: https://angular.io/guide/testing#testing-http-services
        Call = new CallService(
            TestBed.get(AuthService),
            TestBed.get(HackneyAPIService),
            TestBed.get(ManageATenancyAPIService),
            TestBed.get(NCCAPIService),
            TestBed.get(NotesService)
        );
    });

    it('should be created', () => {
        expect(Call).toBeTruthy();
    });
});
