import { Injectable } from '@angular/core';
import { Observable, forkJoin, of, from, ReplaySubject } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { ManageATenancyAPIService } from '../API/ManageATenancyAPI/manageatenancy-api.service';

import { IAccountDetails } from '../interfaces/account-details';
import { ITenancyDPA } from '../interfaces/tenancy-dpa';

@Injectable({
    providedIn: 'root'
})
export class DPAService {

    private _subject$ = new ReplaySubject();
    private _account: IAccountDetails;
    private _crm_contact_id: string;
    private _tenancy: ITenancyDPA;

    constructor(private ManageATenancyAPI: ManageATenancyAPIService) { }

    buildAnswers(crm_contact_id: string) {
        // Tenancy information to obtain:
        // - current balance (multiply by -1);
        // - rent amount;
        // - data field (Mirella is adding this to API);
        // - property reference number.

        if (this._crm_contact_id === crm_contact_id) {
            // We are fetching, or already have, DPA information for this CRM contact ID.
            return of(null); // Observable.of()
        }

        return this.ManageATenancyAPI.getAccountDetails(crm_contact_id)
            .pipe(
                map((data: IAccountDetails) => {
                    if (data) {
                        this._account = data;
                        this._tenancy = {
                            rent_balance: -data.currentBalance,
                            rent_amount: data.rent,
                            tenancy_reference: data.tagReferenceNumber,
                            payment_reference: data.paymentReferenceNumber
                        };
                        this._crm_contact_id = crm_contact_id;
                    }
                    this._subject$.next();
                })
            );
    }

    getUpdates(): ReplaySubject<{}> {
        return this._subject$;
    }

    reset() {
        this._tenancy = null;
    }

    get account(): IAccountDetails {
        return this._account;
    }

    /**
     *
     */
    getPaymentReference(): string {
        return this._tenancy ? this._tenancy.payment_reference : null;
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
