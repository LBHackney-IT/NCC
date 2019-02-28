import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { PAGES } from '../../../common/constants/pages.constant';
import { CallService } from '../../../common/services/call.service';
import { IAccountDetails } from '../../../common/interfaces/account-details';

@Component({
    selector: 'app-rent',
    templateUrl: './rent.component.html',
    styleUrls: ['./rent.component.css']
})
export class PageRentComponent implements OnInit, OnDestroy {

    private _destroyed$ = new Subject();
    account_details: IAccountDetails;
    error: boolean;
    isLeasehold: boolean;
    page_defs = PAGES;

    constructor(
        private route: ActivatedRoute,
        private Call: CallService) { }

    ngOnInit() {

        // Find out whether this account is for a leasehold property.
        // TODO would forkJoin be necessary/appropriate here?
        this.route.data
            .pipe(take(1))
            .subscribe(
                (data: { isLeasehold: boolean }) => {
                    this.isLeasehold = data.isLeasehold;
                },
                () => { this.isLeasehold = false; }
            );

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
