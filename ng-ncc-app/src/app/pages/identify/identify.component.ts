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
    address_list: any; // TODO add a class.
    selected_property_id: string;
    tenant_list: any; // TODO add a class.
    no_results: boolean;

    unique_addresses: any[];


    constructor(private HackneyAPI: HackneyAPIService) { }

    ngOnInit() {
        this._searching = false;
        this.no_results = false;
    }

    /**
     *
     */
    performSearch() {
        // For the time being, we are only searching for people by postcode.
        if (this._searching) {
            return;
        }
        this.no_results = false;
        this.results = null;
        this.unique_addresses = null;
        this.address_list = null;
        this.tenant_list = null;
        this._searching = true;

        let subscription = this.HackneyAPI.getCitizenIndexSearch(null, null, null, this.postcode)
            .subscribe(
                (rows) => {
                    this._searching = false;
                    this.results = rows;
                    this.address_list = this.getAddressResults();
                    this.unique_addresses = this.address_list ? Object.keys(this.address_list) : [];
                    // TODO: Object.keys() will return the keys in sorted order, we want our original order.
                    this.no_results = !this.address_list || (0 === this.address_list.length);
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
    getAddressResults() {
        if (this.results && this.results.length) {

            // Sort the results by their address.
            let addresses = this.results;
            addresses.sort((a, b) => {
                const result = [
                    this._compare(a, b, 'addressLine2'),
                    this._compare(a, b, 'addressLine3'),
                    this._compare(a, b, 'addressLine1'),
                    this._compare(a, b, 'postcode')
                ].filter((v: number) => {
                    return v !== 0;
                })
                    .push(0)
                [0];
                // i.e. use the first non-zero value found, or 0 if all else fails.

                return result;
            });

            // Group the results by their household ID.
            // https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_uniq
            addresses = addresses
                .reduce((r, v, i, a, k = v.householdId) => ((r[k] || (r[k] = []))
                    .push(v), r), {})

            return addresses;
        }
    }

    /**
     *
     */
    _compare(a, b, key: string) {
        if (a[key] > b[key]) {
            return 1;
        }
        if (a[key] < b[key]) {
            return -1;
        }
        return 0;
    }

    /**
     *
     */
    selectHouseholdID(household_id: string) {
        // or more to the point, select the address by household ID.
        this.selected_property_id = household_id;
        this.tenant_list = this.getTenantResults();
        return false;
    }

    /**
     *
     */
    backToPostcodeResults() {
        this.selected_property_id = null;
        this.tenant_list = null;
    }

    /**
     *
     */
    getTenantResults() {
        if (this.selected_property_id) {
            // Find all the entries matching the respective ID.
            const list = this.address_list[this.selected_property_id];
            console.log(list);

            return list;
        }
    }

    /**
     *
     */
    getSelectedPropertyAddress() {
        if (this.selected_property_id) {
            const tenant = this.address_list[this.selected_property_id][0];
            let address = [
                tenant.addressLine1,
                tenant.addressLine2,
                tenant.addressLine3,
                tenant.postcode,
                tenant.addressCity,
                tenant.addressCountry,
            ]
            return address.filter((value: string) => {
                return null !== value && undefined !== value;
            }).join('<br>');
        }
    }

    /**
     *
     */
    noTenantResults() {
        return !(this.tenant_list && this.tenant_list.length > 0);
    }


}
