import { Component, OnInit } from '@angular/core';
import { initAll } from 'govuk-frontend';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AccountDetails } from '../../../interfaces/account-details.interface';
import { NotifyAPIService } from '../../../API/NotifyAPI/notify-api.service';
import { CommsOption } from '../../../classes/comms-option.class';
import { IdentifiedCaller } from '../../../classes/identified-caller.class';
import { ContactDetails } from '../../../classes/contact-details.class';
import { CommsSelection } from '../../../classes/comms-selection.class';
import { CommsTemplate } from '../../../classes/comms-template.class';
import { TemplatePreviewSettings } from '../../../interfaces/template-preview-settings.interface';
import { NotifyAPIJSONResult } from '../../../interfaces/notify-api-json-result.interface';
import { CONTACT } from '../../../constants/contact.constant';
import { CommsMethodDetails } from '../../../interfaces/comms-method-details.interface';

@Component({
    selector: 'app-communications',
    templateUrl: './communications.component.html',
    styleUrls: ['./communications.component.css']
})
export class PageRentCommunicationsComponent implements OnInit {
    CONTACT_METHOD = CONTACT;
    _sending: boolean;
    account_details: AccountDetails;
    caller: IdentifiedCaller;
    comms_options: CommsOption[];
    selected_option: CommsOption;
    selected_details: CommsSelection;
    preview: TemplatePreviewSettings;
    modal: { [propKey: string]: boolean };

    constructor(private NotifyAPI: NotifyAPIService, private route: ActivatedRoute) { }

    ngOnInit() {
        // Initialise the GOV.UK Frontend components on this page.
        initAll();

        this._sending = false;
        this.selected_option = null;
        this.selected_details = null;
        this.modal = {
            confirmed: false,
            error: false,
            dpa: false
        };

        this.route.data
            .subscribe((data) => {
                this.account_details = data.accountDetails;
                this.caller = data.caller;
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
        return null !== this.selected_option && null !== this.selected_details;
    }

    /**
     * Returns TRUE if the Send button should be made available.
     */
    shouldShowSendButton(): boolean {
        return null !== this.selected_details;
    }

    /**
     *
     */
    selectedOption(option: CommsOption) {
        this.selected_option = option;
        if (option.isSensitive()) {
            this.modal.dpa = true;
        } else {
            this.updatePreview();
        }
    }

    /**
     * Called when valid communication method and respective details are entered.
     */
    onSelectCommsMethod(details: CommsSelection) {
        this.selected_details = details;
        console.log(details);
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
            if (!selected) {
                // We might not have a selected template! If the previously selected method was made invalid, it will happen.
                return;
            }
            if (this.preview && selected && this.preview.template_id === selected.id) {
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
        const method: string = this.selected_details.method;
        const address: string = this.selected_details.getDetail();
        const parameters = this.preview.parameters;

        this._sending = true;
        let observe: Observable<any>;

        switch (method) {
            case CONTACT.METHOD_EMAIL:
                // Send an email.
                console.log('send email', address, template_id);
                observe = this.NotifyAPI.sendEmail(address, template_id, parameters);
                break;

            case CONTACT.METHOD_SMS:
                // Send a text message.
                console.log('send sms', address, template_id);
                observe = this.NotifyAPI.sendSMS(address, template_id, parameters);
                break;

            default:
                console.log('Unsupported method:', method);
                this._sending = false;
        }

        if (observe) {
            const subscription = observe.subscribe(
                (feedback) => {
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
                    this.modal.error = true;
                },
                () => {
                    subscription.unsubscribe();
                    this._sending = false;
                });
        }
    }

}
