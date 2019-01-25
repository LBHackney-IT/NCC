import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subject, of } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';

import { DPAService } from '../../../common/services/dpa.service';
import { IAccountDetails } from '../../../common/interfaces/account-details';

@Component({
    selector: 'app-dpa-tenancy',
    templateUrl: './dpa-tenancy.component.html',
    styleUrls: ['./dpa-tenancy.component.scss']
})
export class DPATenancyComponent implements OnInit, OnDestroy {
    @Input() crmContactID: string;

    private _destroyed$ = new Subject();
    error: boolean;

    constructor(private DPA: DPAService) { }

    /**
     *
     */
    ngOnInit() {
        this.DPA.buildAnswers(this.crmContactID)
            .pipe(
                takeUntil(this._destroyed$),
                catchError((err, caught) => {
                    this.error = true;
                    return of([]);
                })
            )
            .subscribe();
    }

    /**
     *
     */
    ngOnDestroy() {
        this._destroyed$.next();
    }

    /**
     *
     */
    getAccount(): IAccountDetails {
        return this.DPA.account;
    }
    /**
     *
     */
    getTenancyDPAReference(): string {
        return this.DPA.getTenancyReference();
    }

    /**
     *
     */
    getTenancyDPAStartDate(): string {
        return this.DPA.getTenancyStartDate();
    }

    /**
     *
     */
    getTenancyDPAPaymentReference(): string {
        return this.DPA.getPaymentReference();
    }

    /**
     *
     */
    getTenancyDPABalance(): string {
        const result = this.DPA.getTenancyRentBalance();
        return null === result ? null : result.toString();
    }

    /**
     *
     */
    getTenancyDPARent(): string {
        const result = this.DPA.getTenancyRentAmount();
        return result ? result.toString() : null;
    }

}
