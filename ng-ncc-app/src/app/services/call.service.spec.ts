import { TestBed, inject } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { CallService } from './call.service';
import { HackneyAPIService } from '../API/HackneyAPI/hackney-api.service';
import { ManageATenancyAPIService } from '../API/ManageATenancyAPI/manageatenancy-api.service';
import { NCCAPIService } from '../API/NCCAPI/ncc-api.service';
import { NotesService } from './notes.service';

let Call: CallService;
let AuthServiceSpy: jasmine.SpyObj<AuthService>;
let HackneyAPIServiceSpy: jasmine.SpyObj<HackneyAPIService>;
let ManageATenancyAPIServiceSpy: jasmine.SpyObj<ManageATenancyAPIService>;
let NCCAPIServiceSpy: jasmine.SpyObj<NCCAPIService>;
let NotesServiceSpy: jasmine.SpyObj<NotesService>;

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
