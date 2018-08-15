import { Component, OnInit } from '@angular/core';
import { initAll } from 'govuk-frontend'
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { NotifyAPIService } from '../../API/NotifyAPI/notify-api.service';
import { CommsOption } from '../../classes/comms-option.class';
import { ContactDetails } from '../../classes/contact-details.class';
import { CommsTemplate } from '../../classes/comms-template.class';
import { TemplatePreviewSettings } from '../../classes/template-preview-settings.class';
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
    selected_details: CommsMethodDetails;
    preview: TemplatePreviewSettings;

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
        this.selected_details = details;
        this.updatePreview();
    }

    /**
     * Called when an invalid communication method and respective details are entered.
     */
    onInvalidCommsMethod() {
        this.selected_details = null;
    }

    updatePreview() {
        if (this.shouldShowPreview()) {
            let selected: CommsTemplate = this.selected_option.templates[this.selected_details.method];
            if (this.preview && this.preview.template_id !== selected.id) {
                return;
            }
            this.preview = new TemplatePreviewSettings(selected.id, selected.version);
        }
    }

}
