import { Component, OnInit } from '@angular/core';
import { PageHistoryComponent } from '../history.component';

@Component({
    selector: 'app-view-notes',
    templateUrl: './view-notes.component.html',
    styleUrls: ['./view-notes.component.scss']
})
export class PageViewNotesComponent extends PageHistoryComponent implements OnInit {

    // TODO this page will require information about a call.

    /**
     *
     */
    ngOnInit() {
        this.updateDummyHistory();
    }

    /**
     *
     */
    _makeDummyRow() {
        const types = ['AD.', 'Agent notes'];
        const statuses = ['Statement', 'Rent paid', 'Arrears cleared', 'Sent refund form'];
        const comments = ['Changed contact details', 'Rent paid', 'Arrears cleared', 'Statement'];
        const agents = ['Clinton', 'Andrea', 'John', 'Mikael', 'Nasra'];

        return {
            date: new Date().toLocaleDateString('en-GB'),
            type: types[Math.floor(Math.random() * types.length)],
            status: statuses[Math.floor(Math.random() * statuses.length)],
            comments: comments[Math.floor(Math.random() * comments.length)],
            agent: agents[Math.floor(Math.random() * agents.length)],
            attachments: null
        };
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
