import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subject, of } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';

import { DPAService } from '../../services/dpa.service';

@Component({
    selector: 'app-dpa-tenancy',
    templateUrl: './dpatenancy.component.html',
    styleUrls: ['./dpatenancy.component.scss']
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
    getAccount(): string {
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
