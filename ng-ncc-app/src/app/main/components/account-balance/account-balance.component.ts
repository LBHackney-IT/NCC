import { Component, Input } from '@angular/core';

import { IAccountDetails } from '../../../common/interfaces/account-details';
import { TENURE_CHARGE } from 'src/app/common/constants/tenure-charge.constant';
import { ITenure } from 'src/app/common/interfaces/tenure';

@Component({
    selector: 'app-account-balance',
    templateUrl: './account-balance.component.html',
    styleUrls: ['./account-balance.component.scss']
})
export class AccountBalanceComponent {
    @Input() account: IAccountDetails;
    @Input() tenure: ITenure;

    /**
     *
     */
    getChargeFrequency(): string {
        if (this.tenure) {
            switch (this.tenure.charged) {
                case TENURE_CHARGE.WEEKLY:
                    return '(per week)';
                case TENURE_CHARGE.MONTHLY:
                    return '(per month)';
            }
        }
        return null;
    }
}
