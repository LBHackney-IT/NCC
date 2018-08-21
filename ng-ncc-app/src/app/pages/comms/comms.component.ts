import { Component, OnInit } from '@angular/core';
import { initAll } from 'govuk-frontend';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { NotifyAPIService } from '../../API/NotifyAPI/notify-api.service';
import { CommsOption } from '../../classes/comms-option.class';
import { ContactDetails } from '../../classes/contact-details.class';
import { CommsTemplate } from '../../classes/comms-template.class';
import { TemplatePreviewSettings } from '../../interfaces/template-preview-settings.interface';
import { NotifyAPIJSONResult } from '../../interfaces/notify-api-json-result.interface';
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
    modal: any;

    constructor(private NotifyAPI: NotifyAPIService, private route: ActivatedRoute) { }

    ngOnInit() {
        // Initialise the GOV.UK Frontend components on this page.
        initAll();

        this.CONTACT_METHOD = CONTACT;

        this.selected_option = null;
        this.modal = {
            confirmed: false,
            error: false
        };

        this.route.data
            .subscribe((data) => {
                this.comms_options = data.templates;
            });
    }

    /**
     * Returns TRUE if the specified communication method is available.
     */
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

    /**
     * Updates the template displayed in the preview area.
     */
    updatePreview() {
        if (this.shouldShowPreview()) {
            const selected: CommsTemplate = this.selected_option.templates[this.selected_details.method];
            if (this.preview && selected && this.preview.template_id !== selected.id) {
                return;
            }
            this.preview = {
                template_id: selected.id,
                version: selected.version,
                parameters: {}
            };
        }
    }

    /**
     * Attempts to send the selected message via the Notify API.
     */
    sendMessage(event) {
        if (event && event.defaultPrevented) {
            return;
        }

        const template_id: string = this.selected_option.templates[this.selected_details.method].id;
        const address: string = this.selected_details.details;
        const parameters = this.preview.parameters;
        let observe: Observable<any>;

        switch (this.selected_details.method) {
            case CONTACT.METHOD_EMAIL:
                // Send an email.
                console.log('send email', address, template_id);
                observe = this.NotifyAPI.sendEmail(address, template_id, parameters);
                break;

            case CONTACT.METHOD_SMS:
                // Send a text message.
                console.log('send sms', address, template_id);
                observe = this.NotifyAPI.sendSMS(address, template_id, {});
                break;

            default:
                console.log('Unsupported method at present:', this.selected_details.method);
        }

        if (observe) {
            const subscription = observe.subscribe(
                (feedback) => {
                    console.log(feedback);
                    /*
                    {
                      "response": {
                        "content": {
                          "from_email": "hackney.council.housing.contact@notifications.service.gov.uk",
                          "body": "...",
                          "subject": "Your Call With Us"
                        },
                        "id": "3151d743-c118-42a7-bad6-85c57c8c1555",
                        "reference": null,
                        "uri": "https://api.notifications.service.gov.uk/v2/notifications/...",
                        "template": {
                          "id": "6dc4b959-62e1-4c28-abef-faf67376b372",
                          "uri": "https://api.notifications.service.gov.uk/services/...",
                          "version": 2
                        }
                      }
                    }
                    */
                    this.modal.confirmed = true;
                },
                (error) => {
                    console.log('Error sending text message:', error);
                    this.modal.error = true;
                },
                () => {
                    subscription.unsubscribe();
                });
        }
    }

}
