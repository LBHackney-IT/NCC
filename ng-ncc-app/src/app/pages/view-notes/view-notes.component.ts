import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-view-notes',
    templateUrl: './view-notes.component.html',
    styleUrls: ['./view-notes.component.scss']
})
export class PageViewNotesComponent implements OnInit {

    // TODO this page will require information about a call.
    // TODO this page is very similar to transaction history, perhaps we could have a generic component that they both extend.

    // PROPERTIES.
    history: { [propKey: string]: any }[];
    filtered_history: { [propKey: string]: any }[];

    // PROPERTIES WITH VALUES.
    period = 'six-months';
    period_options = [
        { key: 'six-months', label: 'Last 6 months' },
        { key: 'twelve-months', label: 'Last 12 months' },
        { key: '2017', label: '2017' },
        { key: '2016', label: '2016' }
    ];
    filter = { type: null };

    /**
     *
     */
    ngOnInit() {
        this.makeDummyHistory();
        this.filterHistory();
    }

    /**
     *
     */
    makeDummyHistory(row_count: number = 30) {
        this.history = [];

        const types = ['AD.', 'Agent notes'];
        const statuses = ['Statement', 'Rent paid', 'Arrears cleared', 'Sent refund form'];
        const comments = ['Changed contact details', 'Rent paid', 'Arrears cleared', 'Statement'];
        const agents = ['Clinton', 'Andrea', 'John', 'Mikael', 'Nasra'];
        const rows = Math.random() * row_count + 10;

        for (let i = 1; i <= rows; i++) {
            this.history.push({
                date: new Date().toLocaleDateString('en-GB'),
                type: types[Math.floor(Math.random() * types.length)],
                status: statuses[Math.floor(Math.random() * statuses.length)],
                comments: comments[Math.floor(Math.random() * comments.length)],
                agent: agents[Math.floor(Math.random() * agents.length)],
                attachments: null
            });
        }
    }


    /**
     *
     */
    updateDummyHistory() {
        switch (this.period) {
            case 'six-months':
                this.makeDummyHistory(30);
                break;
            case 'twelve-months':
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
     * Filter the transaction history by type (case insensitive).
     */
    filterHistory() {
        const term: string = this.filter.type;
        if (null === term) {
            this.filtered_history = this.history;
        } else {
            this.filtered_history = this.history.filter(
                item => item.type && -1 !== item.status.toLowerCase().indexOf(term.toLowerCase())
            );
        }
    }

}
