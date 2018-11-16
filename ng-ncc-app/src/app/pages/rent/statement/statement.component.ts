import { environment } from '../../../../environments/environment';
import { Component, Injector, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { PageCommunications } from '../../abstract/communications';

@Component({
    selector: 'app-rent-statement',
    templateUrl: './statement.component.html',
    styleUrls: ['./statement.component.scss']
})
export class PageRentStatementComponent extends PageCommunications implements OnInit {

    from_date: string = '13/08/2017';
    until_date: string = '15/08/2018';
    statement_url: SafeResourceUrl;

    private sanitiser: DomSanitizer;

    constructor(private injector: Injector) {
        super(injector);
        this.sanitiser = this.injector.get(DomSanitizer);
    }

    ngOnInit() {
        super.ngOnInit();
    }

    /**
     *
     */
    getContactID(): string {
        return '84b2db6d-7aef-e611-86a4-00505698417b';
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
            const url = `${environment.api.statement}?contactid=${this.getContactID()}&startdate=${this.from_date}&enddate=${this.until_date}`;
            this.statement_url = this.sanitiser.bypassSecurityTrustResourceUrl(url);
        }
    }

    /**
     * Attempts to send the selected message via the Notify API.
     */
    sendMessage(event) {
        if (event && event.defaultPrevented) {
            return;
        }

        console.log('Send the statement!');
    }

}
