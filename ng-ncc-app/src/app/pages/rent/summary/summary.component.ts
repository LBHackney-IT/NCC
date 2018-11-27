import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { CONTACT } from '../../../constants/contact.constant';
import { PAGES } from '../../../constants/pages.constant';
import { IAccountDetails } from '../../../interfaces/account-details';
import { ITransaction } from '../../../interfaces/transaction';
import { CommsOption } from '../../../classes/comms-option.class';
import { CommsSelection } from '../../../classes/comms-selection.class';
import { NotifyAPIService } from '../../../API/NotifyAPI/notify-api.service';
import { ManageATenancyAPIService } from '../../../API/ManageATenancyAPI/manageatenancy-api.service';
import { CallService } from '../../../services/call.service';
import { PageTitleService } from '../../../services/page-title.service';

@Component({
    selector: 'app-rent-summary',
    templateUrl: './summary.component.html',
    styleUrls: ['./summary.component.scss']
})
export class PageRentSummaryComponent implements OnInit, OnDestroy {

    private _destroyed$ = new Subject();

    CONTACT_METHOD = CONTACT;
    account_details: IAccountDetails;
    comms_options: CommsOption[];
    selected_method: CommsSelection;
    selected_template: CommsOption; // what to send.
    payment_history: { [propKey: string]: any }[];
    summary_cutoff: Date;

    constructor(private Call: CallService, private NotifyAPI: NotifyAPIService, private ManageATenancyAPI: ManageATenancyAPIService,
        private route: ActivatedRoute, private PageTitle: PageTitleService) { }

    ngOnInit() {
        this.PageTitle.set(PAGES.RENT_SUMMARY.label);

        this.selected_template = null;
        this.selected_method = null;
        this.summary_cutoff = new Date();
        this.summary_cutoff.setMonth(this.summary_cutoff.getMonth() - 6);

        this.Call.getAccount()
            .pipe(takeUntil(this._destroyed$))
            .subscribe((account: IAccountDetails) => { this.account_details = account; });

        this.route.data
            .pipe(
                takeUntil(this._destroyed$)
            )
            .subscribe((data) => {
                this.comms_options = data.templates;
            });
    }

    ngOnDestroy() {
        this._destroyed$.next();
    }

    /**
     * Returns TRUE if the specified communication method is available.
     */
    isMethodAvailable(type: string): boolean {
        if (this.selected_template) {
            return !!(this.selected_template.hasTemplate(type));
        }

        return false;
    }

    /**
     * Called when valid communication method and respective details are entered.
     */
    onSelectCommsMethod(details: CommsSelection) {
        this.selected_method = details;
    }

    /**
     * Called when an invalid communication method and respective details are entered.
     */
    onInvalidCommsMethod() {
        this.selected_method = null;
    }

    /**
     *
     */
    isInCredit(): boolean {
        return this.account_details && this.account_details.currentBalance > 0;
    }

    /**
     *
     */
    isInDebit(): boolean {
        return this.account_details && this.account_details.currentBalance < 0;
    }

}
