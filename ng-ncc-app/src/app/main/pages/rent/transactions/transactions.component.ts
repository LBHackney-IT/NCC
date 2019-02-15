import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PAGES } from '../../../../common/constants/pages.constant';
import { IAccountDetails } from '../../../../common/interfaces/account-details';
import { PageHistory } from '../../abstract/history';
import { CallService } from '../../../../common/services/call.service';
import { PageTitleService } from '../../../../common/services/page-title.service';

@Component({
    selector: 'app-rent-transactions',
    templateUrl: './transactions.component.html',
    styleUrls: ['./transactions.component.scss']
})
export class PageRentTransactionsComponent extends PageHistory implements OnInit, OnDestroy {

    private _destroyed$ = new Subject();

    account_details: IAccountDetails;

    filter: {
        min_date: Date | null,
        max_date: Date | null,
        manual: { [propKey: string]: string }
    };

    filter_type: string;

    constructor(
        private Call: CallService,
        private route: ActivatedRoute,
        private router: Router,
        private PageTitle: PageTitleService) {
        super();
    }

    /**
     *
     */
    ngOnInit() {
        this.PageTitle.set(PAGES.RENT_TRANSACTIONS.label);

        // Set up the filter.
        this.filter = {
            min_date: null,
            max_date: null,
            manual: {}
        };

        // TODO can this be cleaned up with forkJoin()?
        this.Call.getAccount()
            .pipe(takeUntil(this._destroyed$))
            .subscribe((account: IAccountDetails) => { this.account_details = account; });

        this.route.data
            .pipe(
                takeUntil(this._destroyed$)
            )
            .subscribe(() => {
                this._doFilter();
            });
    }

    ngOnDestroy() {
        this._destroyed$.next();
    }

    private _doFilter() {
        this.filterTransactions();
        this.filterByDate();
    }

    /**
     * Set the manual filtering options for the list of transactions.
     */
    filterTransactions() {
        this.filter.manual = {
            description: this.filter_type
        };
    }

    /**
     * Clear the transaction filter.
     */
    clearFilter() {
        this.filter_type = null;
        this._doFilter();
    }

    /**
     * Begin creating a statement.
     */
    createStatement() {
        this.router.navigate([PAGES.RENT_STATEMENT.route]);
    }

}
