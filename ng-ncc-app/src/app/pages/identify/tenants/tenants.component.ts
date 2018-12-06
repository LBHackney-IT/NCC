import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { PAGES } from '../../../constants/pages.constant';
import { HackneyAPIService } from '../../../API/HackneyAPI/hackney-api.service';
import { AddressSearchService } from '../../../services/address-search.service';
import { BackLinkService } from '../../../services/back-link.service';
import { CallService } from '../../../services/call.service';
import { IAddressSearchGroupedResult } from '../../../interfaces/address-search-grouped-result';
import { ICitizenIndexSearchResult } from '../../../interfaces/citizen-index-search-result';
import { IdentifiedCaller } from '../../../classes/identified-caller.class';
import { NonTenantCaller } from '../../../classes/non-tenant-caller.class';
import { AnonymousCaller } from '../../../classes/anonymous-caller.class';
import { ICaller } from '../../../interfaces/caller';

@Component({
    selector: 'app-tenants',
    templateUrl: './tenants.component.html',
    styleUrls: ['./tenants.component.scss']
})
export class PageIdentifyTenantsComponent implements OnInit {

    address: IAddressSearchGroupedResult;
    error: boolean;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private AddressSearch: AddressSearchService,
        private BackLink: BackLinkService,
        private Call: CallService,
        private HackneyAPI: HackneyAPIService
    ) { }

    ngOnInit() {
        this.address = this.AddressSearch.getAddress();

        if (!this.Call.hasTenancy()) {
            // The Back link should go to the addresses subpage.
            this.BackLink.enable();
            this.BackLink.setTarget(`${PAGES.IDENTIFY.route}/${PAGES.IDENTIFY_ADDRESSES.route}`);
        }
    }

    /**
     * Called if we want to edit a tenant's contact details.
     */
    tenantToEdit(caller: IdentifiedCaller) {
        this.Call.setCaller(caller);
        this.Call.setTenancy(this.address);
        this.router.navigateByUrl(PAGES.EDIT_CONTACT_DETAILS.route)
            .catch(() => {
                caller.error = true;
                return of([]);
            });
    }

    /**
     * Called when a tenant is selected from address results.
     */
    tenantSelected(caller: ICaller) {
        // if (caller.isAnonymous()) {
        //     // We've selected "Not a tenant" (a non-tenant caller).
        //     this.Call.setCaller(new NonTenantCaller);
        // } else {
        //     // We've identified a tenant as the caller.
        this.Call.setCaller(caller);
        // }
        this.Call.setTenancy(this.address);
        this.nextStep();
    }

    /**
     * Navigatw to the next step, having selected a tenant (or an anonymous caller).
     */
    nextStep() {
        if (this.Call.hasCaller()) {
            // If caller is identified the ‘continue' button should take you to ’Caller Notes'.
            // If caller is anonymous the ‘caller is anonymous’ button should take you to ‘General Communications’.
            // Decided in isolation.
            // TODO determine which page (comms or payment) to go to, based on the call type and reason.
            this.router.navigateByUrl(this.Call.isCallerIdentified() ? PAGES.VIEW_NOTES.route : PAGES.COMMS.route);
        }
    }

}
