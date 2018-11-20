import { environment } from '../../../../environments/environment';
import { Component, Injector, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as moment from 'moment';

import { PAGES } from '../../../constants/pages.constant';
import { PageCommunications } from '../../abstract/communications';
import { BackLinkService } from '../../../services/back-link.service';
import { CommsSelection } from '../../../classes/comms-selection.class';

@Component({
    selector: 'app-rent-statement',
    templateUrl: './statement.component.html',
    styleUrls: ['./statement.component.scss']
})
export class PageRentStatementComponent extends PageCommunications implements OnInit {

    from_date: string;
    until_date: string;
    statement_url: SafeResourceUrl;

    private BackLink: BackLinkService;
    private sanitiser: DomSanitizer;

    constructor(private injector: Injector) {
        super(injector);
        this.BackLink = this.injector.get(BackLinkService);
        this.sanitiser = this.injector.get(DomSanitizer);
    }

    ngOnInit() {
        super.ngOnInit();

        this.BackLink.enable();
        this.BackLink.setTarget(PAGES.RENT_TRANSACTIONS.route);

        // Set default dates.
        this.until_date = moment().format('DD/MM/YYYY');
        this.from_date = moment().subtract(30, 'days').format('DD/MM/YYYY');

        // Automatically generate a statement.
        this.refreshStatement();
    }

    /**
     *
     */
    getContactID(): string {
        return this.Call.getCaller().getContactID();
    }

    /**
     *
     */
    canRefresh(): boolean {
        return !!(this.from_date && this.until_date);
    }

    /**
     *
     */
    refreshStatement() {
        if (this.canRefresh()) {
            const url = `${environment.api.statement}?contactid=${this.getContactID()}` +
                `&startdate=${this.from_date}&enddate=${this.until_date}`;
            this.statement_url = this.sanitiser.bypassSecurityTrustResourceUrl(url);
        }
    }

    /**
     * Called when valid communication method and respective details are entered.
     */
    onSelectCommsMethod(details: CommsSelection) {
        this.selected_details = details;
    }

    onInvalidCommsMethod() {
        this.selected_details = null;
    }


    /**
     * Attempts to send the selected message via the Notify API.
     */
    sendStatement(event) {
        if (event && event.defaultPrevented) {
            return;
        }

        // console.log('Send the statement!');
    }

}
