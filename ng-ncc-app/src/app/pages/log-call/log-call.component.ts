import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ILogCallSelection } from '../../interfaces/log-call-selection';
import { LogCallReason } from '../../classes/log-call-reason.class';
import { LogCallType } from '../../classes/log-call-type.class';
import { CallService } from '../../services/call.service';
import { PageLogCallNature } from '../abstract/log-call-nature';

@Component({
    selector: 'app-page-log-call',
    templateUrl: './log-call.component.html',
    styleUrls: ['./log-call.component.css']
})

export class PageLogCallComponent extends PageLogCallNature implements OnInit {

    previous_calls: { [propKey: string]: any }[];

    constructor(private router: Router, private Call: CallService) {
        super();
    }

    ngOnInit() {
        this._makePreviousCalls();
    }

    /**
    * This is called when the call type is set/changed, and resets the selected call reason.
    */
    proceed() {
        super.proceed();

        // Set the call type and reason for the current call.
        this.Call.setCallNature(this.selected);

        // Go to the Caller Details page.
        this.router.navigateByUrl('caller-details');
    }

    /**
     *
     */
    _makePreviousCalls() {
        this.previous_calls = new Array<any>();
        for (let i = 1; i <= 10; i++) {
            this.previous_calls.push({
                reference: `07891/${i}`,
                name: 'Mr ' + (String.fromCharCode(65 + i - 1)) + ' Bell',
                date: new Date().toLocaleDateString('en-GB'),
                time: new Date().toLocaleTimeString('en-GB'),
                call_reason: ['Pay rent', 'General', 'ASB', 'Repairs', 'Other'][(Math.random() * 4).toFixed(0)]
            });
        }
    }

    /**
     *
     */
    getLastCalls() {
        return this.previous_calls;
    }

    /**
     *
     */
    trackByIndex(index: number, item: {}): number {
        return index;
    }

}
