import { environment } from '../../../../environments/environment';
import { LOCALE_ID, Component, Inject, Injector, OnInit } from '@angular/core';
import { formatCurrency } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { finalize, take, takeUntil } from 'rxjs/operators';
import * as moment from 'moment';

// NOTE: Statements are now referred to as Rent Transactions in the front end.

import { PAGES } from '../../../constants/pages.constant';
import { CONTACT } from '../../../constants/contact.constant';
import { PageCommunications } from '../../abstract/communications';
import { BackLinkService } from '../../../services/back-link.service';
import { CommsSelection } from '../../../classes/comms-selection.class';
import { IAccountDetails } from '../../../interfaces/account-details';
import { INotifyAPIJSONResult } from '../../../interfaces/notify-api-json-result';
import { INotifyStatementParameters } from '../../../interfaces/notify-statement-parameters';
import { UHTriggerService } from '../../../services/uhtrigger.service';

@Component({
    selector: 'app-rent-statement',
    templateUrl: './statement.component.html',
    styleUrls: ['./statement.component.scss']
})
export class PageRentStatementComponent extends PageCommunications implements OnInit {

    account: IAccountDetails;
    from_date: string;
    until_date: string;
    statement_url: SafeResourceUrl;
    sending: boolean;
    success_message: string;

    private BackLink: BackLinkService;
    private sanitiser: DomSanitizer;

    constructor(@Inject(LOCALE_ID) private locale: string, private injector: Injector) {
        super(injector);
        this.BackLink = this.injector.get<BackLinkService>(BackLinkService);
        this.sanitiser = this.injector.get(DomSanitizer);
        this.UHTrigger = this.injector.get<UHTriggerService>(UHTriggerService);
        // see https://stackoverflow.com/questions/49424837/lint-warning-get-is-deprecated-when-trying-to-manually-inject-ngcontrol
    }

    ngOnInit() {
        super.ngOnInit();

        this.BackLink.enable();
        this.BackLink.setTarget(`${PAGES.RENT.route}/${PAGES.RENT_TRANSACTIONS.route}`);

        // Set default dates.
        this.until_date = moment().format('DD/MM/YYYY');
        this.from_date = moment().subtract(30, 'days').format('DD/MM/YYYY');

        // Obtain account details.
        this.Call.getAccount()
            .pipe(takeUntil(this._destroyed$))
            .subscribe((account) => {
                this.account = account;

                // Automatically generate a statement.
                this.refreshStatement();
            });
    }

    /**
     *
     */
    getContactID(): string {
        return this.Call.getCaller().getContactID();
    }

    /**
    * Returns TRUE if we should be able to refresh the rent transactions preview.
     */
    canRefresh(): boolean {
        return !!(this.from_date && this.until_date);
    }

    /**
     * Returns TRUE if we should be able to send the rent transactions.
     */
    canSend(): boolean {
        if (this.sending) {
            return false;
        }
        if (CONTACT.METHOD_POST === this.selected_details.method) {
            return true;
        }
        return this.selected_details.isComplete();
    }

    /**
     *
     */
    refreshStatement() {
        if (this.canRefresh()) {
            const url = `${environment.api.statement}?contactid=${this.getContactID()}` +
                `&tenagreementref=${this.account.tagReferenceNumber}` +
                `&startdate=${this.from_date}` +
                `&enddate=${this.until_date}`;
            // console.log(url);
            this.statement_url = this.sanitiser.bypassSecurityTrustResourceUrl(url);
        }
    }

    /**
     * Called when valid communication method and respective details are entered.
     */
    onSelectCommsMethod(details: CommsSelection) {
        this.selected_details = details;
    }

    /**
     *
     */
    onInvalidCommsMethod() {
        this.selected_details = null;
    }

    /**
     *
     */
    getButtonText(): string {
        // switch (this.selected_details.method) {
        //     case CONTACT.METHOD_EMAIL:
        return 'Send';
        //     default:
        //         return 'Print';
        // }
    }


    /**
     * Attempts to send the selected message via the Notify API.
     */
    sendStatement(event) {
        if (event && event.defaultPrevented) {
            return;
        }

        switch (this.selected_details.method) {
            case CONTACT.METHOD_EMAIL:

                // Build a set of parameters for sending the statement.
                const parameters = {
                    EmailTo: this.selected_details.getDetail(),
                    ContactId: this.getContactID(),
                    StartDate: this.from_date,
                    EndDate: this.until_date,
                    TemplateId: environment.notifyTemplate.statement,
                    TemplateData: {
                        'rent amount': formatCurrency(this.account.rent, this.locale, '£'),
                        'rent balance': formatCurrency(this.account.currentBalance, this.locale, '£')
                    }
                } as INotifyStatementParameters;

                // Send the statement!
                this.sending = true;
                this.success_message = null;
                this.NotifyAPI.sendEmailStatement(parameters)
                    .pipe(take(1))
                    .pipe(finalize(() => { this.sending = false; }))
                    .subscribe(
                        (json: INotifyAPIJSONResult) => {
                            if (1 === json.response) {
                                this.success_message = 'Rent transactions sent successfully.';
                                this.modal.confirmed = true;

                                // Create an automatic note.
                                this.UHTrigger.sentStatement('email');
                            } else {
                                this.modal.error = true;
                            }
                        },
                        () => {
                            this.modal.error = true;
                        });
                break;

            case CONTACT.METHOD_POST:
                this.success_message = '\'Send by post\' confirmed.';
                this.modal.confirmed = true;

                // Create an automatic note.
                this.UHTrigger.sentStatement('post');
                break;
        }
    }

    /**
     *
     */
    commsSuccess() {
        // Go to the Transactions tab on the Rent page.
        this.router.navigate([`${PAGES.RENT.route}/${PAGES.RENT_TRANSACTIONS.route}`]);
    }

}
