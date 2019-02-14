import { Injectable } from '@angular/core';

import { IAccountDetails } from '../../common/interfaces/account-details';

@Injectable({
    providedIn: 'root'
})
export class NextPaymentService {

    /**
     *
     */
    calculate(account: IAccountDetails): number {
        if (account) {
            return -(account.currentBalance + account.rent - account.benefit);
        }
        return null;
    }

}
