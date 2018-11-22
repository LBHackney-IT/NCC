import { Injectable, Injector, OnInit, OnDestroy } from '@angular/core';
import { initAll } from 'govuk-frontend';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { IAccountDetails } from '../../interfaces/account-details';
import { NotifyAPIService } from '../../API/NotifyAPI/notify-api.service';
import { CallService } from '../../services/call.service';
import { CommsOption } from '../../classes/comms-option.class';
import { IdentifiedCaller } from '../../classes/identified-caller.class';
import { IContactDetails } from '../../classes/contact-details.class';
import { CommsSelection } from '../../classes/comms-selection.class';
import { CommsTemplate } from '../../classes/comms-template.class';
import { ITemplatePreviewSettings } from '../../interfaces/template-preview-settings';
import { INotifyAPIJSONResult } from '../../interfaces/notify-api-json-result';
import { CONTACT } from '../../constants/contact.constant';
import { ICommsMethodDetails } from '../../interfaces/comms-method-details';
import { UHTriggerService } from '../../services/uhtrigger.service';
import { PageTitleService } from '../../services/page-title.service';

@Injectable()
export class PageCommunications implements OnInit, OnDestroy {

    private _destroyed$ = new Subject();

    CONTACT_METHOD = CONTACT;
    _sending: boolean;
    account_details: IAccountDetails;
    caller: IdentifiedCaller;
    comms_options: CommsOption[];
    selected_option: CommsOption;
    selected_details: CommsSelection;
    preview: ITemplatePreviewSettings;
    modal: { [propKey: string]: boolean };
    _error: boolean;

    Call: CallService;
    NotifyAPI: NotifyAPIService;
    route: ActivatedRoute;
    UHTrigger: UHTriggerService;
    PageTitle: PageTitleService;

    constructor(private injectorObj: Injector) {
        // See https://stackoverflow.com/a/48723478/4073160
        this.Call = this.injectorObj.get(CallService);
        this.NotifyAPI = this.injectorObj.get(NotifyAPIService);
        this.route = this.injectorObj.get(ActivatedRoute);
        this.UHTrigger = this.injectorObj.get(UHTriggerService);
        this.PageTitle = this.injectorObj.get(PageTitleService);
    }

    ngOnInit() {
        this._sending = false;
        this.selected_option = null;
        this.selected_details = null;
        this.modal = {
            confirmed: false,
            error: false,
            dpa: false
        };

        this.route.data
            .pipe(
                takeUntil(this._destroyed$)
            )
            .subscribe((data) => {
                this.account_details = data.IAccountDetails;
                this.caller = data.caller;
            });
    }

    ngOnDestroy() {
        this._destroyed$.next();
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
        return null !== this.selected_option && null !== this.selected_details && CONTACT.METHOD_POST !== this.selected_details.method;
    }

    /**
     * Returns TRUE if the Send button should be made available.
     */
    shouldShowSendButton(): boolean {
        return null !== this.selected_details;
    }

    /**
    * Called when a comms form (GOV.UK Notify template) is selected.
     */
    selectedOption(option: CommsOption) {
        this.selected_option = option;
        this.updatePreview();
    }

    /**
     * Called when valid communication method and respective details are entered.
     */
    onSelectCommsMethod(details: CommsSelection) {
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
     * Returns the text to use for the "save" button.
     * In the case of post, we're not sending anything via GOV.UK Notify but recording that something was sent.
     */
    getSendButtonText(): string {
        switch (this.selected_details.method) {
            case CONTACT.METHOD_POST:
                return 'Send';
            // return 'Save';
            default:
                return 'Send';
        }
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

        if (CONTACT.METHOD_POST === this.selected_details.method) {
            // TODO Record that something is going to be sent by post.
            this.modal.confirmed = true;
            return;
        }

        const template_id: string = this.selected_option.templates[this.selected_details.method].id;
        const template_name: string = this.selected_option.name;
        const method: string = this.selected_details.method;
        const address: string = this.selected_details.getDetail();
        const parameters = this.preview.parameters;

        this._sending = true;
        let observe: Observable<any>;

        switch (method) {
            case CONTACT.METHOD_EMAIL:
                // Send an email.
                // TODO Record that something was sent via email.
                observe = this.NotifyAPI.sendEmail(address, template_id, parameters);
                break;

            case CONTACT.METHOD_SMS:
                // Send a text message.
                // TODO Record that something was sent via SMS.
                observe = this.NotifyAPI.sendSMS(address, template_id, parameters);
                break;

            default:
                // console.log('Unsupported method:', method);
                this._sending = false;
        }

        if (observe) {
            const subscription = observe.subscribe(
                (feedback) => {
                    this.modal.confirmed = true;
                    this.UHTrigger.sentComms(template_name, method, parameters);
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

    /**
     *
     */
    trackByIndex(index: number, item: {}): number {
        return index;
    }

    /**
     *
     */
    commsError() {
        this._error = true;
    }

}
