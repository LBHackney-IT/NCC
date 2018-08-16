import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { CitizenIndexSearchResult } from '../../interfaces/citizen-index-search-result.interface';
import { AddressSearchGroupedResult } from '../../interfaces/address-search-grouped-result.interface';

@Component({
    selector: 'app-address-search-results',
    templateUrl: './address-search-results.component.html',
    styleUrls: ['./address-search-results.component.scss']
})
export class AddressSearchResultsComponent implements OnChanges {
    @Input() results: CitizenIndexSearchResult[];
    @Output() selected = new EventEmitter<AddressSearchGroupedResult>();

    grouped_results: AddressSearchGroupedResult[];

    constructor() { }

    /**
     *
     */
    ngOnChanges() {
        this._organiseResults();
    }

    /**
     * Returns TRUE if there are no search results.
     */
    hasNoResults(): boolean {
        return this.results && 0 === this.results.length;
    }

    /**
     * Returns TRUE if there are search results.
     */
    hasResults(): boolean {
        return this.results && 0 < this.results.length;
    }

    /**
     * Called when a result is selected from the list.
     */
    selectRow(result: AddressSearchGroupedResult) {
        this.selected.emit(result);
    }

    /**
     *
     */
    _organiseResults() {
        if (this.results && this.results.length) {

            // Group the results by their household ID.
            // https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_groupby
            const grouped_results = this.results.reduce(
                (r, v: CitizenIndexSearchResult, i, a, k = v.householdId) => (
                    (r[k] || (r[k] = {
                        id: k,
                        address: v.fullAddressDisplay,
                        addressLine1: parseInt(v.addressLine1.toLowerCase()),
                        addressLine1_raw: v.addressLine1.toLowerCase(),
                        addressLine2: v.addressLine2.toLowerCase(),
                        addressLine3: v.addressLine3.toLowerCase(),
                        postcode: v.postCode.toLowerCase(),
                        results: []
                    })).results.push(v), r), {}
            );

            // Sort the results by their address.
            this.grouped_results = this._sortedGroupedResults(grouped_results);
        }
    }

    /**
     *
     */
    _sortedGroupedResults(grouped_results): AddressSearchGroupedResult[] {
        let results: AddressSearchGroupedResult[] = Object.values(grouped_results);
        results.sort((a, b) => {
            const checks = [
                this._compare(a, b, 'addressLine2'),
                this._compare(a, b, 'addressLine3'),
                this._compare(a, b, 'addressLine1'),
                this._compare(a, b, 'addressLine1_raw'),
                this._compare(a, b, 'postcode')
            ];
            const filtered = checks.filter((v: number) => { return 0 !== v; });
            return filtered.length ? filtered[0] : 0;
            // i.e. use the first non-zero value found, or 0 if all else fails.
        });

        return results;
    }

    /**
     * TODO this method is commonly used.
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

}
