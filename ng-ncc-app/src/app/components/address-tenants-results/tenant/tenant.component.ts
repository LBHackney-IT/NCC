import { Component, Input, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';

import { ContactDetailsUpdate } from '../../../classes/contact-details-update.class';
import { IdentifiedCaller } from '../../../classes/identified-caller.class';
import { NCCAPIService } from '../../../API/NCCAPI/ncc-api.service';

@Component({
    selector: 'app-address-tenant',
    templateUrl: './tenant.component.html',
    styleUrls: ['./tenant.component.scss']
})
export class AddressResultTenantComponent implements OnInit {
    // This component exists because we want to use the communications details saved through the NCC API endpoint,
    // rather than those from the Hackney API endpoint.

    @Input() tenant: IdentifiedCaller;

    details: ContactDetailsUpdate;

    constructor(private NCCAPI: NCCAPIService) { }

    ngOnInit() {
        // Attempt to obtain contact details from the NCC API.
        this.NCCAPI.getContactDetails(this.tenant.getContactID())
            .pipe(take(1))
            .subscribe((data: ContactDetailsUpdate) => {
                this.details = data;
            });
    }

    /**
     * Returns a list of telephone numbers (both mobile and landline) for the tenant.
     * Results from the NCC API are given priority.
     */
    getTelephoneNumbers(): string[] {
        const ncc_details = this.details ? this.details.telephone.concat(this.details.mobile) : null;
        const hackney_details = this.tenant.getTelephoneNumbers();

        return ncc_details ? ncc_details : hackney_details;
    }

    /**
    * Returns a list of email addresses for the tenant.
    * Results from the NCC API are given priority.
     */
    getEmailAddresses(): string[] {
        const ncc_details = this.details ? this.details.email : null;
        const hackney_details = this.tenant.getEmailAddresses();

        return ncc_details ? ncc_details : hackney_details;
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

}
