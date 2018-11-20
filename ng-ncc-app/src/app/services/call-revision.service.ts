import { Injectable } from '@angular/core';

import { NCCAPIService } from '../API/NCCAPI/ncc-api.service';
import { ILastCall } from '../interfaces/last-call';

@Injectable({
    providedIn: 'root'
})
export class CallRevisionService {
    // This service is used to add notes to a pre-existing call.

    _call: ILastCall;

    constructor(private NCCAPI: NCCAPIService) { }

    setPreviousCall(call: ILastCall) {
        this._call = call;
    }

}
