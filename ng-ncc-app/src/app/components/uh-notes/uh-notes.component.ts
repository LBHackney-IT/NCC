import { Component, Input, OnChanges, OnInit, OnDestroy, SimpleChange } from '@angular/core';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

import { NCCAPIService } from '../../API/NCCAPI/ncc-api.service';
import { INCCUHNote } from '../../interfaces/ncc-uh-note';
import { NOTES } from '../../constants/notes.constant';

// TODO along with transactions, extend a component providing basic functionality.

@Component({
    selector: 'app-uh-notes',
    templateUrl: './notes.component.html',
    styleUrls: ['./notes.component.scss']
})
export class UHNotesComponent implements OnInit, OnChanges, OnDestroy {
    @Input() tenancyReference: string;
    @Input() refresh: string; // used to reload the list of notes without changing the tenancy reference.
    @Input() tenants: { [propKey: string]: string }[];
    @Input() filter: { [propKey: string]: string };
    @Input() minDate?: Date;
    @Input() maxDate?: Date;

    private _destroyed$ = new Subject();

    error: boolean;
    _loading: boolean;
    _rows: INCCUHNote[];
    _filtered: INCCUHNote[];

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
        if (changes.tenancyReference || changes.refresh) {
            // The tenancy reference has changed, so load the notes associated with the tenancy reference.
            this._loadNotes();
        } else {
            // The filter or date settings have changed, so update what is displayed.
            this._filterNotes();
        }
    }

    /**
     *
     */
    ngOnDestroy() {
        this._destroyed$.next();
    }

    /**
     *
     */
    trackByMethod(index: number, item: INCCUHNote): number {
        return index;
    }

    /**
     *
     */
    _loadNotes() {
        if (this._loading || null === this.tenancyReference) {
            return;
        }

        this._loading = true;
        this.NCCAPI.getDiaryAndNotes(this.tenancyReference)
            .pipe(takeUntil(this._destroyed$))
            .pipe(finalize(() => {
                this._loading = false;
            }))
            .subscribe(
                (rows) => {
                    this._rows = rows;
                    this._filterNotes();
                },
                () => { this.error = true; }
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
                            if (term && 'null' !== term) {
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
    getNoteTypeBadgeClass(note: INCCUHNote) {
        return {
            'call-type--automatic': NOTES.TYPE_AUTOMATIC === note.notesType,
            'call-type--manual': NOTES.TYPE_MANUAL === note.notesType,
            'call-type--diary': NOTES.TYPE_ACTION_DIARY === note.notesType
        };
    }

    /**
     * Returns the name of a tenant matching the specified CRM contact ID.
     */
    getTenantName(note: INCCUHNote): string {
        return note.clientName ? note.clientName : 'anonymous';
    }

}
