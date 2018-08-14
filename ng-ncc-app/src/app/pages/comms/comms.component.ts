import { Component, OnInit } from '@angular/core';
import { initAll } from 'govuk-frontend'
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { NotifyAPIService } from '../../API/NotifyAPI/notify-api.service';
import { CommsOption } from '../../classes/comms-option.class';
import { ContactDetails } from '../../classes/contact-details.class';
import { CONTACT } from '../../constants/contact.constant';
import { CommsMethodDetails } from '../../interfaces/comms-method-details.interface';

@Component({
    selector: 'app-page-comms',
    templateUrl: './comms.component.html',
    styleUrls: ['./comms.component.css']
})
export class PageCommsComponent implements OnInit {

    CONTACT_METHOD: object;
    comms_options: CommsOption[];
    selected_option: CommsOption;
    selected_details: object;

    constructor(private Notify: NotifyAPIService, private route: ActivatedRoute) { }

    ngOnInit() {
        // Initialise the GOV.UK Frontend components on this page.
        initAll();

        this.CONTACT_METHOD = CONTACT;

        this.selected_option = null;

        this.route.data
            .subscribe((data) => {
                this.comms_options = data.templates;
            });
    }

    isMethodAvailable(type: string): boolean {
        if (this.selected_option) {
            return !!(this.selected_option.hasTemplate(type));
        }

        return false;
    }

    /**
     * Returns TRUE if the messgae preview should be shown.
     */
    shouldShowPreview(): boolean {
        return null !== this.selected_details;
    }

    /**
     * Returns TRUE if the Send button should be made available.
     */
    shouldShowSendButton(): boolean {
        return null !== this.selected_details;
    }

    /**
     * Called when valid communication method and respective details are entered.
     */
    onSelectCommsMethod(details: CommsMethodDetails) {
        console.log('comms method: ', details.method, details.details);
        this.selected_details = details;
    }

    /**
     * Called when an invalid communication method and respective details are entered.
     */
    onInvalidCommsMethod() {
        console.log('comms method invalidated.');
        this.selected_details = null;
    }


}
