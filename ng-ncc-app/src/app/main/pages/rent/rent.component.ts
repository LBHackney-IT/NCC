import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, of } from 'rxjs';
import { take, takeUntil, catchError } from 'rxjs/operators';

import { PAGES } from '../../constants/pages.constant';
import { CallService } from '../../services/call.service';
import { IAccountDetails } from '../../interfaces/account-details';

@Component({
    selector: 'app-rent',
    templateUrl: './rent.component.html',
    styleUrls: ['./rent.component.css']
})
export class PageRentComponent implements OnInit, OnDestroy {

    private _destroyed$ = new Subject();
    account_details: IAccountDetails;
    error: boolean;
    page_defs = PAGES;

    constructor(private Call: CallService) { }

    ngOnInit() {
        // Obtain the account details to be able to display the tenancy reference, balance and rent amount.
        this.Call.getAccount()
            .pipe(takeUntil(this._destroyed$))
            .subscribe(
                (data) => { this.account_details = data; },
                () => {
                    this.error = true;
                }
            );
    }

    ngOnDestroy() {
        this._destroyed$.next();
    }


    isIdentifiedCaller(): boolean {
        return this.Call.isCallerIdentified();
    }

}
