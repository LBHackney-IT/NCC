import { Component, OnInit } from '@angular/core';
import { initAll } from 'govuk-frontend'
import { NotifyService } from '../../API/Notify/notify.service';
import { CommsSelection } from '../../classes/comms-selection.class';

@Component({
    selector: 'app-page-comms',
    templateUrl: './comms.component.html',
    styleUrls: ['./comms.component.css']
})
export class PageCommsComponent implements OnInit {

    METHOD_SMS: string = 'sms';
    METHOD_EMAIL: string = 'email';
    METHOD_POST: string = 'letter';

    templates: Array<any>;

    selection: CommsSelection;

    constructor(private Notify: NotifyService) { }

    ngOnInit() {
        // Initialise the GOV.UK Frontend components on this page.
        initAll();

        this.selection = new CommsSelection;
    }

    /**
     * Returns TRUE if the messgae preview should be shown.
     */
    shouldShowPreview(): boolean {
        return this.selection.isComplete();
    }

    /**
     * Returns TRUE if the Send button should be made available.
     */
    shouldShowSendButton(): boolean {
        return this.selection.isComplete();
    }

}
