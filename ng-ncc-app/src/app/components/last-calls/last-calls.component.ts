import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { NCCAPIService } from '../../API/NCCAPI/ncc-api.service';
import { ILastCall } from '../../interfaces/last-call';

@Component({
    selector: 'app-last-calls',
    templateUrl: './last-calls.component.html',
    styleUrls: ['./last-calls.component.scss']
})
export class LastCallsComponent implements OnInit, OnDestroy {
    @Input() count: number;

    calls: ILastCall[];
    private _destroyed$ = new Subject();

    constructor(private NCCAPI: NCCAPIService) { }

    /**
     *
     */
    ngOnInit() {
        if (this.count) {
            this.NCCAPI.getLastCalls(this.count)
                .pipe(
                    takeUntil(this._destroyed$)
                )
                .subscribe((rows: ILastCall[]) => {
                    this.calls = rows;
                });
        }
    }

    /**
     *
     */
    ngOnDestroy() {
        this._destroyed$.next();
    }

}
