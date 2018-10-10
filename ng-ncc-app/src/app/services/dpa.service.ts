import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { ManageATenancyAPIService } from '../API/ManageATenancyAPI/manageatenancy-api.service';

import { IAccountDetails } from '../interfaces/account-details';
import { ITenancyDPA } from '../interfaces/tenancy-dpa';

@Injectable({
    providedIn: 'root'
})
export class DPAService {

    private _tenancy: ITenancyDPA;

    constructor(private ManageATenancyAPI: ManageATenancyAPIService) { }

    build(crm_contact_id: string) {
        // Tenancy information to obtain:
        // - current balance (multiply by -1);
        // - rent amount;
        // - data field (Mirella is adding this to API);
        // - property reference number.

        return this.ManageATenancyAPI.getAccountDetails(crm_contact_id)
            .pipe(
                map((data: IAccountDetails) => {
                    this._tenancy = {
                        rent_balance: -data.currentBalance,
                        rent_amount: data.rent,
                        tenancy_reference: data.tagReferenceNumber
                    };
                })
            );
    }

    /**
     *
     */
    getTenancyReference(): string {
        return this._tenancy ? this._tenancy.tenancy_reference : null;
    }

    /**
     *
     */
    getTenancyRentBalance(): number {
        return this._tenancy ? this._tenancy.rent_balance : null;
    }

    /**
     *
     */
    getTenancyRentAmount(): number {
        return this._tenancy ? this._tenancy.rent_amount : null;
    }

}
