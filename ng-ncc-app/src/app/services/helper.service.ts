/**
 * This class contains various "helper" methods.
 */

import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class HelperService {

    private undefined_values = [undefined, null];

    /**
     * Returns TRUE if the specified value is "defined".
     */
    isDefined(value: any): boolean {
        return -1 === this.undefined_values.indexOf(value);
    }

    /**
     * Returns TRUE if the specified value is "undefined".
     */
    isUndefined(value: any): boolean {
        return -1 !== this.undefined_values.indexOf(value);
    }

    /**
     * Returns TRUE if the specified value is "defined" and is not considered empty.
     */
    isPopulated(value: any): boolean {
        if (this.isDefined(value)) {
            const string_value = value.toString().trim();
            return string_value.length > 0;
        }
        return false;
    }

}
