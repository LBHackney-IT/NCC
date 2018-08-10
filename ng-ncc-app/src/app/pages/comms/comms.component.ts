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

    constructor(private Notify: NotifyService) { }

    templates: Array<any>;

    selection: CommsSelection;

    ngOnInit() {
        // Initialise the GOV.UK components on this page.
        initAll();

        this.selection = new CommsSelection;
    }

}
