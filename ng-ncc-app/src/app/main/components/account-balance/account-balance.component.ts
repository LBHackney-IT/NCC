import { Component, Input } from '@angular/core';

import { IAccountDetails } from '../../../common/interfaces/account-details';

@Component({
    selector: 'app-account-balance',
    templateUrl: './account-balance.component.html',
    styleUrls: ['./account-balance.component.scss']
})
export class AccountBalanceComponent {
    @Input() account: IAccountDetails;
    @Input() isLeasehold: boolean;
}
