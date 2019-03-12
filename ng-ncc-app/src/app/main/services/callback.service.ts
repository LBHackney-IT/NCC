import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CallbackService {

    private _details: {};

    constructor() {
        this._details = {};
    }


    get details() {
        return this._details || {};
    }

    set details(value) {
        this._details = value;
    }

}
