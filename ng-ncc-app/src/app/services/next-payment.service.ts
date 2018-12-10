import { Injectable } from '@angular/core';

import { IAccountDetails } from '../interfaces/account-details';

@Injectable({
    providedIn: 'root'
})
export class NextPaymentService {

    /**
     *
     */
    calculate(account: IAccountDetails): number {
        if (account) {
            return -(account.currentBalance + (2 * account.rent) - account.benefit);
        }
        return null;
    }

}
