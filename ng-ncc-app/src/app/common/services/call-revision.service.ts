import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { ILastCall } from '../../common/interfaces/last-call';

@Injectable({
    providedIn: 'root'
})
export class CallRevisionService {
    // This service is used to add notes to a pre-existing call.

    _call: ILastCall;
    callSet = new Subject<ILastCall>();

    setPreviousCall(call: ILastCall) {
        this._call = call;
        this.callSet.next(call);
    }

    getPreviousCall(): ILastCall {
        return this._call;
    }

}
