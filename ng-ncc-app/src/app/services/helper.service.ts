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
        try {
            return -1 === this.undefined_values.indexOf(value);
        } catch {
            return false;
        }
    }

    /**
     * Returns TRUE if the specified value is "undefined".
     */
    isUndefined(value: any): boolean {
        try {
            return -1 !== this.undefined_values.indexOf(value);
        } catch {
            return true;
        }
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

    /**
     * Removed properties from an object where the value is null or undefined.
     */
    removeEmptyValues(object: { [propKey: string]: any }): { [propKey: string]: any } {
        const keys = Object.keys(object);
        for (let i = 0; i < keys.length; i++) {
            if (this.isUndefined(object[keys[i]])) {
                delete object[keys[i]];
            }
        }
        return object;
    }

}
