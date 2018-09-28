import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { LogCallSelection } from '../../interfaces/log-call-selection.interface';
import { LogCallReason } from '../../classes/log-call-reason.class';
import { LogCallType } from '../../classes/log-call-type.class';
import { CallService } from '../../services/call.service';

@Component({
    selector: 'app-page-log-call',
    templateUrl: './log-call.component.html',
    styleUrls: ['./log-call.component.css']
})

export class PageLogCallComponent {

    selected: LogCallSelection;
    previous_calls: { [propKey: string]: any }[];

    constructor(private router: Router, private Call: CallService) { }

    /**
     *
     */
    selectedCallNature(selection: LogCallSelection) {
        this.selected = selection;
        console.log('selected call nature:', this.selected);
    }

    /**
     *
     */
    selectionExists(): boolean {
        return this.selected instanceof LogCallSelection;
    }

    /**
     * Returns TRUE if we should be able to proceed.
     */
    canProceed(): boolean {
        return this.isCallTypeSelected() && this.isCallReasonSelected();
    }

    /**
     *
     */
    isCallTypeSelected(): boolean {
        return this.selectionExists() && this.selected.call_type instanceof LogCallType;
    }

    /**
     *
     */
    isCallReasonSelected(): boolean {
        return this.selectionExists() && this.selected.call_reason instanceof LogCallReason;
    }

    /**
     * This is called when the call type is set/changed, and resets the selected call reason.
     */
    proceed() {
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


}
