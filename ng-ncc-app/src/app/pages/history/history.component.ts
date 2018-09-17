export class PageHistoryComponent {

    PERIOD_SIX_MONTHS = 'six-months';
    PERIOD_TWELVE_MONTHS = 'twelve-months';

    // PROPERTIES.
    history: { [propKey: string]: any }[];
    filtered_history: { [propKey: string]: any }[];

    // PROPERTIES WITH VALUES.
    period = this.PERIOD_SIX_MONTHS;
    period_options = [
        { key: this.PERIOD_SIX_MONTHS, label: 'Last 6 months' },
        { key: this.PERIOD_TWELVE_MONTHS, label: 'Last 12 months' },
        { key: '2017', label: '2017' },
        { key: '2016', label: '2016' }
    ];
    filter: { [propKey: string]: any };

    /**
     * A method to populate the history with fake data.
     */
    makeDummyHistory(row_count: number = 30) {
        const rows = Math.random() * row_count + 10;
        this.history = [];
        for (let i = 1; i <= rows; i++) {
            this.history.push(this._makeDummyRow());
        }
    }

    /**
     * Return a fake data row.
     */
    _makeDummyRow(): { [propKey: string]: any } {
        return {};
    }

    /**
     * Simulate different amounts of dummy data based on the selected period.
     */
    updateDummyHistory() {
        switch (this.period) {
            case this.PERIOD_SIX_MONTHS:
                this.makeDummyHistory(30);
                break;
            case this.PERIOD_TWELVE_MONTHS:
                this.makeDummyHistory(60);
                break;
            case '2017':
            case '2016':
                this.makeDummyHistory(80);
                break;
        }
        this.filterHistory();
    }

    /**
     * A method used to filter the history.
     * By default no filtering is actually done.
     */
    filterHistory() {
        this.filtered_history = this.history;
    }

    clearFilter() {
        this.filter = {};
    }

}
