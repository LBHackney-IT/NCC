import { Component, OnInit } from '@angular/core';
import { initAll } from 'govuk-frontend'
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { NotifyAPIService } from '../../API/NotifyAPI/notify-api.service';
import { CommsSelection } from '../../classes/comms-selection.class';
import { CommsOption } from '../../classes/comms-option.class';
import { ContactDetails } from '../../classes/contact-details.class';
import { CONTACT } from '../../constants/contact.constant';

@Component({
    selector: 'app-page-comms',
    templateUrl: './comms.component.html',
    styleUrls: ['./comms.component.css']
})
export class PageCommsComponent implements OnInit {

    CONTACT_METHOD: object;
    comms_options: CommsOption[];
    selection: CommsSelection;

    constructor(private Notify: NotifyAPIService, private route: ActivatedRoute) { }

    ngOnInit() {
        // Initialise the GOV.UK Frontend components on this page.
        initAll();

        this.selection = new CommsSelection;
        this.CONTACT_METHOD = CONTACT;

        this.route.data
            .subscribe((data) => {
                this.comms_options = data.templates;
            });
    }

    resetMethod() {
        if (!(this.selection.method && this.isMethodAvailable(this.selection.method))) {
            console.log('reset method.');
            this.selection.method = null;
            if (this.selection.form) {
                console.log(CONTACT.METHOD_EMAIL, this.selection.form.hasTemplate(CONTACT.METHOD_EMAIL));
                console.log(CONTACT.METHOD_POST, this.selection.form.hasTemplate(CONTACT.METHOD_POST));
                console.log(CONTACT.METHOD_SMS, this.selection.form.hasTemplate(CONTACT.METHOD_SMS));
            }
        }
    }

    isMethodAvailable(type: string): boolean {
        if (this.selection.form) {
            return !!(this.selection.form.hasTemplate(type));
        }

        return false;
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
