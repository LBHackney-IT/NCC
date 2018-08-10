import { Component, OnInit } from '@angular/core';
import { initAll } from 'govuk-frontend'
import { NotifyService } from '../../API/Notify/notify.service';
import { CommsSelection } from '../../classes/comms-selection.class';
import { ContactDetails } from '../../classes/contact-details.class';
import { CONTACT } from '../../constants/contact.constant';

@Component({
    selector: 'app-page-comms',
    templateUrl: './comms.component.html',
    styleUrls: ['./comms.component.css']
})
export class PageCommsComponent implements OnInit {

    CONTACT_METHOD: object;
    templates: Array<any>;
    selection: CommsSelection;

    constructor(private Notify: NotifyService) { }

    ngOnInit() {
        // Initialise the GOV.UK Frontend components on this page.
        initAll();

        this.selection = new CommsSelection;
        this.CONTACT_METHOD = CONTACT;
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

    prepareNewDetail(key: string) {
        this.selection.existing[key] = null;
    }

}
