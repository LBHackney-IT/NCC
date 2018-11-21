import { LOCALE_ID, Component, Inject, Injector, OnInit } from '@angular/core';
import { formatCurrency } from '@angular/common';
import { take } from 'rxjs/operators';

import { PAGES } from '../../../constants/pages.constant';
import { CommsOption } from '../../../classes/comms-option.class';
import { PageCommunications } from '../../abstract/communications';
import { DPAService } from '../../../services/dpa.service';
import { IAccountDetails } from '../../../interfaces/account-details';

@Component({
    selector: 'app-rent-communications',
    templateUrl: './communications.component.html',
    styleUrls: ['./communications.component.css']
})
export class PageRentCommunicationsComponent extends PageCommunications implements OnInit {

    constructor(@Inject(LOCALE_ID) private locale: string, private injector: Injector) {
        super(injector);
    }

    /**
     *
     */
    ngOnInit() {
        super.ngOnInit();
        this.PageTitle.set(PAGES.RENT_COMMS.label);
        this.Call.getAccount()
            .pipe(take(1))
            .subscribe((account: IAccountDetails) => { this.account_details = account; });
    }

    /**
     *
     */
    selectedOption(option: CommsOption) {
        super.selectedOption(option);

        // This page will provide access to GOV.UK Notify templates that will require DPA answers from the caller.
        if (option.isSensitive()) {
            this.modal.dpa = true; // display the dialogue for prompting for DPA answers.
        } else {
            this.updatePreview();
        }
    }

    /**
     *
     */
    isSensitiveTemplateSelected(): boolean {
        return this.selected_option.isSensitive();
    }

    /**
     *
     */
    updatePreview() {
        super.updatePreview();
        if (this.isSensitiveTemplateSelected() && this.preview) {
            this.preview.parameters = {
                'Tenancy reference': this.account_details.tagReferenceNumber,
                'Rent balance': formatCurrency(this.account_details.currentBalance, this.locale, '£'),
                'Rent amount': formatCurrency(this.account_details.rent, this.locale, '£')
            };
        }
    }

}
