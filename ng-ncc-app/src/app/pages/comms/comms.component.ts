import { Component, OnInit } from '@angular/core';
import { initAll } from 'govuk-frontend'
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { NotifyAPIService } from '../../API/NotifyAPI/notify-api.service';
import { NotifyTemplate } from '../../classes/notify-template.class';
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

    constructor(private Notify: NotifyAPIService, private route: ActivatedRoute) { }

    ngOnInit() {
        // Initialise the GOV.UK Frontend components on this page.
        initAll();

        this.selection = new CommsSelection;
        this.CONTACT_METHOD = CONTACT;

        this.route.data
            .subscribe((data) => {
                console.log('templates?', data);
            });
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
