import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { ICitizenIndexSearchResult } from '../../interfaces/citizen-index-search-result';
import { IAddressSearchGroupedResult } from '../../interfaces/address-search-grouped-result';

@Component({
    selector: 'app-address-search-results',
    templateUrl: './address-search-results.component.html',
    styleUrls: ['./address-search-results.component.scss']
})
export class AddressSearchResultsComponent implements OnChanges {
    @Input() results: ICitizenIndexSearchResult[];
    @Output() selected = new EventEmitter<IAddressSearchGroupedResult>();

    grouped_results: IAddressSearchGroupedResult[];

    constructor() { }

    /**
     *
     */
    ngOnChanges() {
        this._organiseResults();
    }

    trackByMethod(index: number, item: IAddressSearchGroupedResult): string {
        return item.id;
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
    selectRow(result: IAddressSearchGroupedResult) {
        this.selected.emit(result);
    }

    /**
     *
     */
    _organiseResults() {
        if (this.results && this.results.length) {

            console.log(this.results);

            // Group the results.
            // Results from the sandbox API had a "householdID" key, which was missing from live data.
            // The only thing we could really use was the "fullAddressSearch" key.
            // https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_groupby
            const grouped_results = this.results.reduce(
                (r, v: ICitizenIndexSearchResult, i, a, k = v.fullAddressSearch) => (
                    (r[k] || (r[k] = {
                        id: k,
                        address: v.fullAddressDisplay,
                        addressLine1: parseInt(v.addressLine1.toLowerCase(), 10),
                        addressLine1_raw: v.addressLine1.toLowerCase(),
                        addressLine2: v.addressLine2.toLowerCase(),
                        addressLine3: v.addressLine3.toLowerCase(),
                        postcode: v.postCode.toLowerCase(),
                        results: []
                    })).results.push(v), r), {}
            );

            console.log(this.grouped_results);

            // Sort the results by their address.
            this.grouped_results = this._sortedGroupedResults(grouped_results);
        }
    }

    /**
     *
     */
    _sortedGroupedResults(grouped_results): IAddressSearchGroupedResult[] {
        const results: IAddressSearchGroupedResult[] = Object.values(grouped_results);
        results.sort((a, b) => {
            const checks = [
                this._compare(a, b, 'addressLine2'),
                this._compare(a, b, 'addressLine3'),
                this._compare(a, b, 'addressLine1'),
                this._compare(a, b, 'addressLine1_raw'),
                this._compare(a, b, 'postcode')
            ];
            const filtered = checks.filter((v: number) => 0 !== v);
            // shorthand for function(v) { return 0 !== v; }
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
