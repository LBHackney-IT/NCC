import { Component, OnInit } from '@angular/core';
import { HackneyAPIService } from '../../API/HackneyAPI/hackney-api.service';
import { CitizenIndexSearchResult } from '../../interfaces/citizen-index-search-result.interface';

@Component({
    selector: 'app-page-identify',
    templateUrl: './identify.component.html',
    styleUrls: ['./identify.component.css']
})
export class PageIdentifyComponent implements OnInit {

    _searching: boolean;
    postcode: string;
    results: CitizenIndexSearchResult[];

    constructor(private HackneyAPI: HackneyAPIService) { }

    ngOnInit() {
        this._searching = false;
    }

    /**
     *
     */
    performSearch() {
        // For the time being, we are only searching for people by postcode.
        if (this._searching) {
            return;
        }
        this.results = null;
        this._searching = true;

        let subscription = this.HackneyAPI.getCitizenIndexSearch(null, null, null, this.postcode)
            .subscribe(
                (rows) => {
                    this._searching = false;
                    this.results = rows;
                },
                (error) => {
                    console.error(error);
                },
                () => {
                    subscription.unsubscribe();
                }
            );
    }

    /**
     *
     */
    canPerformSearch() {
        return !this._searching && !!(this.postcode);
    }

    /**
     *
     */
    selectHouseholdID(household_id: string) {
        // // or more to the point, select the address by household ID.
        // this.selected_property_id = household_id;
        // return false;
    }

    /**
     *
     */
    backToPostcodeResults() {
        // this.selected_property_id = null;
    }

    /**
     *
     */
    getTenantResults() {
        // if (this.selected_property_id) {
        //     // Find all the entries matching the respective ID.
        //     const list = this.address_list[this.selected_property_id];
        //     console.log(list);
        //
        //     return list;
        // }
    }

    /**
     *
     */
    getSelectedPropertyAddress() {
        // if (this.selected_property_id) {
        //     const tenant = this.address_list[this.selected_property_id][0];
        //     let address = [
        //         tenant.addressLine1,
        //         tenant.addressLine2,
        //         tenant.addressLine3,
        //         tenant.postcode,
        //         tenant.addressCity,
        //         tenant.addressCountry,
        //     ]
        //     return address.filter((value: string) => {
        //         return null !== value && undefined !== value;
        //     }).join('<br>');
        // }
    }

    /**
     *
     */
    noTenantResults() {
        // return !(this.tenant_list && this.tenant_list.length > 0);
    }


}
