import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PAGES } from '../../../common/constants/pages.constant';
import { CallService } from '../../../common/services/call.service';
import { PageLogCallNature } from '../abstract/log-call-nature';
import { PageTitleService } from '../../../common/services/page-title.service';

@Component({
    selector: 'app-log-additional',
    templateUrl: './log-additional.component.html',
    styleUrls: ['./log-additional.component.scss']
})
export class PageLogAdditionalComponent extends PageLogCallNature implements OnInit {

    constructor(private router: Router, private Call: CallService, private PageTitle: PageTitleService) {
        super();
    }

    ngOnInit() {
        this.PageTitle.set(PAGES.ADDITIONAL_REASON.label);
    }

    /**
   * This is called when the call type is set/changed, and resets the selected call reason.
   */
    proceed() {
        super.proceed();

        // Set the call type and reason for the current call.
        this.Call.setCallNature(this.selected);

        // Go to the Comms page.
        this.router.navigateByUrl(PAGES.COMMS.route);
    }


}
