import { Component, OnInit } from '@angular/core';
import { initAll } from 'govuk-frontend';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { NotifyAPIService } from '../../API/NotifyAPI/notify-api.service';
import { CommsOption } from '../../classes/comms-option.class';
import { ContactDetails } from '../../classes/contact-details.class';
import { CommsSelection } from '../../classes/comms-selection.class';
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
    _sending: boolean;
    comms_options: CommsOption[];
    selected_option: CommsOption;
    selected_details: CommsSelection;
    preview: TemplatePreviewSettings;
    modal: any;

    constructor(private NotifyAPI: NotifyAPIService, private route: ActivatedRoute) { }

    ngOnInit() {
        // Initialise the GOV.UK Frontend components on this page.
        initAll();

        this.CONTACT_METHOD = CONTACT;
        this._sending = false;
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
     *
     */
    updatePreview() {
        if (this.shouldShowPreview()) {
            const selected: CommsTemplate = this.selected_option.templates[this.selected_details.method];
            if (!selected) {
                // We might not have a selected template! If the previously selected method was made invalid, it will happen.
                return;
            }
            if (this.preview && this.preview.template_id !== selected.id) {
                return;
            }
            this.preview = new TemplatePreviewSettings(selected.id, selected.version);
        }
    }

    /**
     * Attempts to send a message via GOV.UK Notify.
     */
    sendMessage(event) {
        if (event && event.defaultPrevented) {
            return;
        }

        const template_id: string = this.selected_option.templates[this.selected_details.method].id;
        const method: string = this.selected_details.method;
        const address: string = this.selected_details.getDetail();
        let subscription;
        console.log(address);

        this._sending = true;

        switch (method) {
            case CONTACT.METHOD_EMAIL:
                // Send an email.
                console.log('Sending an email to', address);
                subscription = this.NotifyAPI.sendEmail(address, template_id, {})
                    .subscribe(
                        (feedback) => {
                            console.log('Sent email, got feedback:', feedback);
                            this.modal.confirmed = true;
                        },
                        (error) => {
                            console.log('Error sending email:', error);
                            this.modal.error = true;
                        },
                        () => {
                            subscription.unsubscribe();
                            this._sending = false;
                        });
                break;

            case CONTACT.METHOD_SMS:
                // Send a text message.
                console.log('Sending a text message to', address);
                subscription = this.NotifyAPI.sendSMS(address, template_id, {})
                    .subscribe(
                        (feedback) => {
                            console.log('Sent text message, got feedback:', feedback);
                            this.modal.confirmed = true;
                        },
                        (error) => {
                            console.log('Error sending text message:', error);
                            this.modal.error = true;
                        },
                        () => {
                            subscription.unsubscribe();
                            this._sending = false;
                        });
                break;

            default:
                console.log('Unsupported method:', method);
                this._sending = false;
        }
    }

}
