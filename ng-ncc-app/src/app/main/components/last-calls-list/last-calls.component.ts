import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { NCCAPIService } from '../../API/NCCAPI/ncc-api.service';
import { ILastCall } from '../../interfaces/last-call';

@Component({
    selector: 'app-last-calls-list',
    templateUrl: './last-calls.component.html',
    styleUrls: ['./last-calls.component.scss']
})
export class LastCallsListComponent implements OnInit, OnDestroy {
    @Input() count: number;
    @Output() viewNote = new EventEmitter<ILastCall>();

    calls: ILastCall[];
    today: any;
    error: boolean;

    private _destroyed$ = new Subject();

    constructor(private NCCAPI: NCCAPIService) { }

    /**
     *
     */
    ngOnInit() {
        if (this.count) {
            this.NCCAPI.getLastCalls(this.count)
                .pipe(takeUntil(this._destroyed$))
                .subscribe(
                    (rows: ILastCall[]) => { this.calls = rows; },
                    () => { this.error = true; }
                );
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
    trackByIndex(index: number, item: {}): number {
        return index;
    }

    /**
     * Called when the "view" link of a note is selected.
     */
    beginAddNotes(row: ILastCall) {
        this.viewNote.emit(row);
        return false;
    }

    /**
     * Returns text to display for a call's call reason.
     */
    getCallReason(row: ILastCall) {
        if (row.callreason) {
            return row.callreason;
        } else {
            // Other (including the custom call reason).
            return row.otherreason ? `Other: ${row.otherreason}` : 'Other: not specified';
        }
    }

}
