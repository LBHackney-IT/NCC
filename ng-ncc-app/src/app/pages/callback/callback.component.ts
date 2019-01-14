import { Component, OnInit } from '@angular/core';

import { CALL_REASON } from '../../constants/call-reason.constant';
import { ILogCallSelection } from '../../interfaces/log-call-selection';

@Component({
    selector: 'app-page-callback',
    templateUrl: './callback.component.html',
    styleUrls: ['./callback.component.scss']
})
export class PageCallbackComponent implements OnInit {

    recipient: string;  // Recipient or Officer email address.
    teamLeader: string; // Team leader or Manager email address.
    contactNumber: string = null;
    callNature: ILogCallSelection = null;

    constructor() { }

    ngOnInit() {
    }

    numberSelected(number: string) {
        console.log('Selected number:', number);
        this.contactNumber = number;
    }

    natureSelected(call_nature: ILogCallSelection) {
        console.log('Selected call nature:', call_nature);
        this.callNature = call_nature;
    }

    canSave(): boolean {
        return (this.contactNumber) && (this.callNature &&
            (CALL_REASON.OTHER !== this.callNature.call_reason.id || this.callNature.other_reason));
    }

}
