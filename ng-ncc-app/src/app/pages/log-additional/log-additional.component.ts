import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { CallService } from '../../services/call.service';
import { PageLogCallNature } from '../abstract/log-call-nature';

@Component({
    selector: 'app-log-additional',
    templateUrl: './log-additional.component.html',
    styleUrls: ['./log-additional.component.scss']
})
export class PageLogAdditionalComponent extends PageLogCallNature {

    constructor(private router: Router, private Call: CallService) {
        super();
    }

    /**
   * This is called when the call type is set/changed, and resets the selected call reason.
   */
    proceed() {
        super.proceed();

        // Set the call type and reason for the current call.
        this.Call.setCallNature(this.selected);

        // Go to the Caller Details page.
        this.router.navigateByUrl('comms');
    }


}
