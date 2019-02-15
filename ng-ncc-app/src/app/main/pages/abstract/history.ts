export class PageHistory {

    PERIOD_SIX_MONTHS = 'six-months';
    PERIOD_TWELVE_MONTHS = 'twelve-months';

    CURRENT_YEAR = new Date().getFullYear();
    PREVIOUS_YEAR = this.CURRENT_YEAR - 1;
    TWO_YEARS_AGO = this.CURRENT_YEAR - 2;

    // PROPERTIES.
    filter: { [propKey: string]: any };
    history: { [propKey: string]: any }[];
    filtered_history: { [propKey: string]: any }[];

    // PROPERTIES WITH VALUES.
    period = this.PERIOD_SIX_MONTHS;
    period_options = [
        { key: this.PERIOD_SIX_MONTHS, label: 'Last 6 months' },
        { key: this.PERIOD_TWELVE_MONTHS, label: 'Last 12 months' },
        { key: this.CURRENT_YEAR.toString(), label: this.CURRENT_YEAR.toString() },
        { key: this.PREVIOUS_YEAR.toString(), label: this.PREVIOUS_YEAR.toString() },
        { key: this.TWO_YEARS_AGO.toString(), label: this.TWO_YEARS_AGO.toString() }
    ];

    /**
     *
     */
    clearFilter() {
        this.filter = {};
    }

    /**
     * Set the date filtering option for the list of transactions.
     */
    filterByDate() {
        // Set both dates to today by default.
        let min_date = null; // new Date();
        let max_date = null; // new Date();

        switch (this.period) {
            case this.PERIOD_SIX_MONTHS:
                min_date = new Date();
                min_date.setMonth(min_date.getMonth() - 6);
                break;

            case this.PERIOD_TWELVE_MONTHS:
                min_date = new Date();
                min_date.setFullYear(min_date.getFullYear() - 1);
                break;

            default:
                // If the selected option is numeric, assume it is a specific year.
                // Otherwise no date filter will be applied.
                const year = parseInt(this.period, 10);
                if (!Number.isNaN(year)) {
                    min_date = new Date(year, 0, 1);
                    max_date = new Date(year + 1, 0, 0);
                }
        }

        this.filter.min_date = min_date;
        this.filter.max_date = max_date;
    }

    /**
     *
     */
    trackByIndex(index: number, item: { key: string, label: string }): string {
        return item.key;
    }

}
