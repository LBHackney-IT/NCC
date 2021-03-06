import { Component, Input, OnChanges, OnInit, OnDestroy, SimpleChange } from '@angular/core';
import { Subject } from 'rxjs';
import { finalize, take, takeUntil } from 'rxjs/operators';
import * as moment from 'moment';

import { NOTES } from '../../../common/constants/notes.constant';
import { NotesService } from '../../../common/services/notes.service';
import { INCCUHNote } from '../../../common/interfaces/ncc-uh-note';

// TODO along with transactions, extend a component providing basic functionality.

@Component({
    selector: 'app-uh-notes',
    templateUrl: './notes.component.html',
    styleUrls: ['./notes.component.scss']
})
export class UHNotesComponent implements OnInit, OnChanges, OnDestroy {
    @Input() tenancyReference: string;
    @Input() tenants: { [propKey: string]: string }[];
    @Input() filter: { [propKey: string]: string };
    @Input() minDate?: Date | null;
    @Input() maxDate?: Date | null;

    private _destroyed$ = new Subject();

    error: boolean;
    _loading: boolean;
    _rows: INCCUHNote[];
    _filtered: INCCUHNote[];

    constructor(private Notes: NotesService) { }

    /**
     *
     */
    ngOnInit() {
        this._loading = false;

        // Subscribe to note addition events from the Notes service.
        this.Notes.noteWasAdded()
            .pipe(takeUntil(this._destroyed$))
            .subscribe(() => {
                this._loadNotes();

            });
    }

    /**
     *
     */
    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        if (changes.tenancyReference) {
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
     * Fetches a list of notes associated with the specified tenancy reference.
     */
    _loadNotes() {
        if (this._loading || null === this.tenancyReference) {
            return;
        }

        this._loading = true;
        this.Notes.load(this.tenancyReference)
            .pipe(take(1))
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
     * Sets the filter on the list of notes.
     */
    _filterNotes() {
        const min_date = this.minDate ? moment(this.minDate).format('YYYYMMDDHHmmss') : null;
        const max_date = this.maxDate ? moment(this.maxDate).format('YYYYMMDDHHmmss') : null;
        // Keys using being search by input text
        const inputSearch: string[] = ['callReasonType', 'createdBy', 'notes', 'callType'];
        this._filtered = this._rows.filter(
            item => {
                let outcome = true;
                // Check against the provided dates (if set).
                if (outcome && min_date) {
                    outcome = item.createdOnSort >= min_date;
                }
                if (outcome && max_date) {
                    outcome = item.createdOnSort < max_date;
                }

                if (outcome && this.filter) {
                    let inputSearchOutcome = true;
                    let dropdownOutcome = true;
                    // Assign input search outcome to false if the keys to be filtered are not null
                    inputSearch.forEach(key => {
                        inputSearchOutcome = this.filter[key] ? false : inputSearchOutcome;
                    });
                    Object.keys(this.filter).forEach(
                        key => {
                            const term = this.filter[key];
                            // Check if key should be filtered and if it it's null in both the item and filter object
                            if (inputSearch.includes(key) && item[key] && term) {
                                // If there's a match set inputSearchOutcome to true
                                inputSearchOutcome = outcome &&
                                    item[key].toLowerCase().includes(term.toLowerCase())
                                        ? true : inputSearchOutcome;
                                // outcome = inputSearchOutcome;

                            } else {
                                if (term && item[key]) {
                                    // If there's no match set dropdownOutcome to false if not set it to the original outcome
                                    dropdownOutcome = !item[key].toLowerCase().includes(term.toLowerCase())
                                    ? false : dropdownOutcome;
                                }
                            }
                        });
                        outcome = outcome && inputSearchOutcome && dropdownOutcome;
                }
                return outcome;
            });
    }

    /**
     * Returns the name of a tenant matching the specified CRM contact ID.
     */
    getTenantName(note: INCCUHNote): string {
        if (note.clientName) {
            return note.clientName;
        }
        switch (note.notesType) {
            case NOTES.TYPE_ACTION_DIARY:
            case NOTES.TYPE_UH:
                return null;
            default:
                return 'anonymous';
        }
    }

    /**
     * Returns the call type for a note.
     */
    getCallType(note: INCCUHNote): string {
        return note.callType;
    }

    /**
     * Returns the call reason for a note, or "Other" if unspecified.
     */
    getCallReason(note: INCCUHNote): string {
        return note.callReasonType ? note.callReasonType : this._getOtherReason(note);
    }

    /**
     *
     */
    private _getOtherReason(note: INCCUHNote): string {
        if (NOTES.TYPE_MANUAL === note.notesType) {
            return 'Other';
        }
    }

}
