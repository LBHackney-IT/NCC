import { TestBed, inject } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';

import { TransactionService } from './transaction.service';

let httpClientSpy: { get: jasmine.Spy };
let Transaction: TransactionService;

describe('TransactionService', () => {
    beforeEach(() => {
        // from the Angular tutorial: https://angular.io/guide/testing#testing-http-services
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
        Transaction = new TransactionService(<any>httpClientSpy);
    });

    it('should be created', () => {
        expect(Transaction).toBeTruthy();
    });
});
