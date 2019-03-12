import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';

import { PAGES } from '../../../common/constants/pages.constant';
import { CallService } from '../../../common/services/call.service';
import { IAccountDetails } from '../../../common/interfaces/account-details';
import { ITenure } from 'src/app/common/interfaces/tenure';

@Component({
    selector: 'app-rent',
    templateUrl: './rent.component.html',
    styleUrls: ['./rent.component.css']
})
export class PageRentComponent implements OnInit, OnDestroy {

    private _destroyed$ = new Subject();
    account_details: IAccountDetails;
    error: boolean;
    tenure: ITenure;
    page_defs = PAGES;

    constructor(private Call: CallService, private route: ActivatedRoute) { }

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

        this.route.data
            .pipe(take(1))
            .subscribe(
                (data: { tenure: ITenure }) => {
                    console.log(data.tenure);
                    this.tenure = data.tenure;
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
