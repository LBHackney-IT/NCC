import { ICitizenIndexSearchResult } from "src/app/common/interfaces/citizen-index-search-result";

// This class implements the ICaller interface, and exists to provide default methods for each of the caller types.

export class CitizenHelper {

    /**
     *
     */
    public static getAddress(row: ICitizenIndexSearchResult): string {
        // In an unusual scenario the address was empty,
        // but we can hopefully build an address using some other details.
        if (row.fullAddressDisplay) {
            return row.fullAddressDisplay;
        }

        return [row.addressLine1, row.addressLine2, row.addressLine3, row.addressCity, row.postCode].join(' ').toUpperCase();
    }

}
