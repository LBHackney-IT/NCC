import { Component, Input, OnChanges } from '@angular/core';
import { take } from 'rxjs/operators';

import { IAccountDetails } from '../../../../common/interfaces/account-details';
import { ContactDetailsUpdate } from '../../../../common/classes/contact-details-update.class';
import { IdentifiedCaller } from '../../../../common/classes/identified-caller.class';
import { NCCAPIService } from '../../../../common/API/NCCAPI/ncc-api.service';
import { ManageATenancyAPIService } from '../../../../common/API/ManageATenancyAPI/manageatenancy-api.service';

@Component({
    selector: 'app-address-tenant',
    templateUrl: './tenant.component.html',
    styleUrls: ['./tenant.component.scss']
})
export class AddressResultTenantComponent implements OnChanges {
    // This component exists because we want to use the communications details saved through the NCC API endpoint,
    // rather than those from the Hackney API endpoint.

    @Input() tenant: IdentifiedCaller;

    account: IAccountDetails;
    details: ContactDetailsUpdate;

    constructor(private ManageATenancyAPI: ManageATenancyAPIService, private NCCAPI: NCCAPIService) { }

    ngOnChanges() {
        if (this.tenant) {
            // Attempt to obtain contact details from the NCC API.
            this.NCCAPI.getContactDetails(this.tenant.getContactID())
                .pipe(take(1))
                .subscribe((data) => {
                    this.details = data;
                });
        }
    }

    /**
     * Returns a list of telephone numbers (both mobile and landline) for the tenant.
     * Results from the NCC API are given priority.
     */
    getTelephoneNumbers(): string[] {
        if (this.tenant) {
            const ncc_details = this.details ? this.details.telephone.concat(this.details.mobile) : null;
            const hackney_details = this.tenant.getTelephoneNumbers();

            return ncc_details ? ncc_details : hackney_details;
        }

        return [];
    }

    /**
    * Returns a list of email addresses for the tenant.
    * Results from the NCC API are given priority.
     */
    getEmailAddresses(): string[] {
        if (this.tenant) {
            const ncc_details = this.details ? this.details.email : null;
            const hackney_details = this.tenant.getEmailAddresses();

            return ncc_details ? ncc_details : hackney_details;
        }

        return [];
    }

    /**
     * Returns TRUE if the tenant has no email addresses on file.
     */
    hasNoEmailAddresses(): boolean {
        const emails = this.getEmailAddresses();
        return 0 === emails.length;
    }

    /**
    * Returns TRUE if the tenant has no telephone numbers on file.
     */
    hasNoTelephoneNumbers(): boolean {
        const numbers = this.getTelephoneNumbers();
        return 0 === numbers.length;
    }

    /**
     *
     */
    trackByMethod(index: number, item: string): number {
        return index;
    }

    /**
     *
     */
    isDefaultEmail(email: string): boolean {
        if (this.details) {
            return email === this.details.default.email;
        }
        return false;
    }

    /**
     *
     */
    isDefaultTelephone(telephone: string): boolean {
        if (this.details) {
            return telephone === this.details.default.telephone || telephone === this.details.default.mobile;
        }
        return false;
    }

}
