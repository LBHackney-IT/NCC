import { Component, Input, OnChanges, OnInit, SimpleChange } from '@angular/core';
import { NCCAPIService } from '../../API/NCCAPI/ncc-api.service';
import { NCCNote } from '../../interfaces/ncc-note.interface';
import { NOTES } from '../../constants/notes.constant';

// TODO along with transactions, extend a component providing basic functionality.

@Component({
    selector: 'app-notes',
    templateUrl: './notes.component.html',
    styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit, OnChanges {
    @Input() crmContactID: string;
    @Input() tenants: { [propKey: string]: string }[];
    @Input() filter: { [propKey: string]: string };
    @Input() minDate?: Date;
    @Input() maxDate?: Date;

    _loading: boolean;
    _rows: NCCNote[];
    _filtered: NCCNote[];

    constructor(private NCCAPI: NCCAPIService) { }

    /**
     *
     */
    ngOnInit() {
        this._loading = false;
    }

    /**
     *
     */
    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        if (changes.crmContactID) {
            // The tenancy reference has changed, so load the transactions associated with the tenancy reference.
            this._loadNotes();
        } else {
            // The filter or date settings have changed, so update what is displayed.
            this._filterNotes();
        }
    }

    /**
     *
     */
    _loadNotes() {
        this._loading = true;
        const subscription = this.NCCAPI.getNotes(this.crmContactID)
            .subscribe(
                (rows) => {
                    this._rows = rows;
                    this._filterNotes();
                },
                (error) => {
                    console.error(error);
                },
                () => {
                    subscription.unsubscribe();
                    this._loading = false;
                }
            );
    }

    /**
     *
     */
    _filterNotes() {
        const min_date = this.minDate ? this.minDate.toISOString() : null;
        const max_date = this.maxDate ? this.maxDate.toISOString() : null;

        this._filtered = this._rows.filter(
            item => {
                let outcome = true;

                // Check against the provided dates (if set).
                if (outcome && min_date) {
                    outcome = item.createdOn >= min_date;
                }
                if (outcome && max_date) {
                    outcome = item.createdOn < max_date;
                }

                if (outcome && this.filter) {
                    // Put the item through the filter.
                    Object.keys(this.filter).forEach(
                        key => {
                            const term = this.filter[key];
                            if (term) {
                                outcome = outcome && (-1 !== item[key].toLowerCase().indexOf(term.toLowerCase()));
                            }
                        });
                }
                return outcome;
            });
    }

    /**
     *
     */
    getNoteTypeBadgeClass(note: NCCNote) {
        return {
            'call-type--automatic': NOTES.TYPE_AUTOMATIC === note.notesType,
            'call-type--manual': NOTES.TYPE_MANUAL === note.notesType,
            'call-type--diary': NOTES.TYPE_ACTION_DIARY === note.notesType
        };
    }

    /**
     * Returns the name of a tenant matching the specified CRM contact ID.
     */
    getTenantName(crm_contact_id: string): string {
        if (this.tenants) {
            const tenant = this.tenants.filter((row) => row.contact_id === crm_contact_id);
            return tenant.length ? tenant.shift().full_name : 'n/a';
        }

        return 'anonymous';
    }

}
