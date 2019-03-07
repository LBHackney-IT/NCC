// This component fetches information from the NCC API to display a tenancy's current balance.
// The current balance is calculated by the API.

import { Component, Input, OnChanges } from '@angular/core';

import { CurrentBalanceComponent } from '../current-balance/current-balance.component';

@Component({
    selector: 'app-display-balance',
    templateUrl: './display-balance.component.html',
    styleUrls: ['./display-balance.component.scss']
})
export class DisplayBalanceComponent extends CurrentBalanceComponent {

    @Input() indicate: boolean;

    /**
     *
     */
    isInCredit(): boolean {
        return (this.indicate && this.details) ? (this.details.displayBalance > 0) : false;
    }

    /**
     *
     */
    isInDebit(): boolean {
        return (this.indicate && this.details) ? (this.details.displayBalance < 0) : false;
    }

}
