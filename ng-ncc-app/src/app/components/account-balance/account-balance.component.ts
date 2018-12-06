import { Component, Input } from '@angular/core';

import { IAccountDetails } from '../../interfaces/account-details';

@Component({
    selector: 'app-account-balance',
    templateUrl: './account-balance.component.html',
    styleUrls: ['./account-balance.component.scss']
})
export class AccountBalanceComponent {
    @Input() account: IAccountDetails;

    /**
     *
     */
    isInCredit(): boolean {
        return this.account && this.account.currentBalance > 0;
    }

    /**
     *
     */
    isInDebit(): boolean {
        return this.account && this.account.currentBalance < 0;
    }

}
