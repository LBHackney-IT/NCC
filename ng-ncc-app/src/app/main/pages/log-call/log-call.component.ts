import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PAGES } from '../../constants/pages.constant';
import { ILogCallSelection } from '../../interfaces/log-call-selection';
import { LogCallReason } from '../../classes/log-call-reason.class';
import { LogCallType } from '../../classes/log-call-type.class';
import { CallService } from '../../services/call.service';
import { PageLogCallNature } from '../abstract/log-call-nature';
import { PageTitleService } from '../../services/page-title.service';
import { NotesService } from '../../services/notes.service';

@Component({
    selector: 'app-page-log-call',
    templateUrl: './log-call.component.html',
    styleUrls: ['./log-call.component.css']
})

export class PageLogCallComponent extends PageLogCallNature implements OnInit {

    previous_calls: { [propKey: string]: any }[];

    constructor(private router: Router, private Call: CallService, private Notes: NotesService, private PageTitle: PageTitleService) {
        super();
    }

    ngOnInit() {
        this.PageTitle.set(PAGES.LOG_CALL.label);
        this.Notes.disable();
    }

    /**
    * This is called when the call type is set/changed, and resets the selected call reason.
    */
    proceed() {
        super.proceed();

        // Set the call type and reason for the current call.
        this.Call.setCallNature(this.selected);

        // Go to the Caller Details page.
        this.router.navigateByUrl(PAGES.IDENTIFY.route);
    }

    /**
     *
     */
    trackByIndex(index: number, item: {}): number {
        return index;
    }

}
