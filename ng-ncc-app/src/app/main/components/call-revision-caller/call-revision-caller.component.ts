import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CallRevisionService } from 'src/app/common/services/call-revision.service';
import { ILastCall } from 'src/app/common/interfaces/last-call';

@Component({
    selector: 'app-call-revision-caller',
    templateUrl: './call-revision-caller.component.html',
    styleUrls: ['./call-revision-caller.component.scss']
})
export class CallRevisionCallerComponent implements OnInit {
    @Input() allowAnonymous: boolean;

    private _destroy$ = new Subject<void>();
    previousCall: ILastCall;

    constructor(private CallRevision: CallRevisionService) { }

    ngOnInit() {
        this.CallRevision.callSet
            .pipe(takeUntil(this._destroy$))
            .subscribe((previousCall: ILastCall) => {
                this.previousCall = previousCall;
            });
    }

    ngOnDestroy() {
        this._destroy$.next();
    }

    /**
     *
     */
    get callerName(): string | null {
        if (this.previousCall) {
            return this.previousCall.name;
        }
        return null;
    }

}
