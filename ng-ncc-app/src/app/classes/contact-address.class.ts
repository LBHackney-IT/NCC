export class ContactAddress {
    line_1: string;
    line_2: string;
    town: string;
    county: string;
    postcode: string;

    /**
     * Instead of being represented as [object Object], display the address parts when referenced as a string.
     */
    toString() {
        if (this.isValid()) {
            const parts = [this.line_1, this.line_2, this.town, this.county, this.postcode].filter(function(line: string) {
                return (undefined !== line) && (0 < line.length);
            });

            return parts.length ? parts.join(', ') : null;
        }
    }

    isValid() {
        const valid = true;
        const required = [this.line_1, this.town, this.postcode];
        required.forEach(function(value) {
            valid = valid && (undefined !== value && 0 < value.length);
        });

        return valid;
    }
}
