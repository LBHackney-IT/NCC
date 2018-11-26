import { TestBed, inject } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';

import { NotesService } from './notes.service';

let httpClientSpy: { get: jasmine.Spy };
let Notes: NotesService;

describe('NotesService', () => {
    beforeEach(() => {
        // from the Angular tutorial: https://angular.io/guide/testing#testing-http-services
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
        Notes = new NotesService(<any>httpClientSpy);
    });

    it('should be created', () => {
        expect(Notes).toBeTruthy();
    }));
});
