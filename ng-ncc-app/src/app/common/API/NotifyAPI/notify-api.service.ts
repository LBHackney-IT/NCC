import { environment } from '../../../../environments/environment';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, take } from 'rxjs/operators';
import { Observable, forkJoin, of, from } from 'rxjs';

import { INotifyAPIJSONResult } from '../../interfaces/notify-api-json-result';
import { INotifyStatementParameters } from '../../interfaces/notify-statement-parameters';
import { CommsOption } from '../../classes/comms-option.class';
import { CommsTemplate } from '../../classes/comms-template.class';
import { INotifyAPITemplate } from '../../interfaces/notify-api-template';
import { CONTACT } from '../../constants/contact.constant';

@Injectable({
    providedIn: 'root'
})

/**
 * NotifyAPIService
 * This service is intended to provide access to the GOV.UK Notify API.
 */
export class NotifyAPIService {

    _url = environment.api.notify;

    constructor(private http: HttpClient) { }

    /**
     * Returns a list of GOV.UK Notify templates.
     */
    getTemplates(ofType: string) {
        // TODO confirm the type of template requested.
        return this.http
            .get(`${this._url}/GetAllTemplates?TemplateType=${ofType}`)
            .pipe(
                map((data: INotifyAPIJSONResult) => {
                    // Prepare the data returned from the microservice as a list of templates.
                    const templates: Array<object> = Array.from(data.response.templates);

                    return templates;
                })
            );
    }

    getAllTemplates() {
        return forkJoin(
            this.getTemplates(CONTACT.METHOD_EMAIL),
            this.getTemplates(CONTACT.METHOD_POST),
            this.getTemplates(CONTACT.METHOD_SMS)
        ).pipe(
            map(
                (data) => {
                    const template_list = data.reduce((a, b) => a.concat(b), []);
                    const results = this._organiseTemplates(template_list);
                    // https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_flatten
                    return results;
                },
                () => of([]) // equivalent to function() { return of([]); }.
            )
        );
    }

    /**
     * Returns a preview of a specified GOV.UK Notify template.
     */
    getTemplatePreview(template_id: string, version: number = 1): Observable<INotifyAPITemplate> {
        return this.http
            .get(`${this._url}/GetTemplateByIdAndVersion?TemplateId=${template_id}&Version=${version}`)
            .pipe(
                map((data: INotifyAPIJSONResult) => data.response)
            );
    }

    /**
     * Send an email message through GOV.UK Notify.
     */
    sendEmail(email: string, template_id: string, data: { [propKey: string]: string }) {
        // NOTE: A gotcha with this endpoint is that it takes GET style parameters instead of via POST.
        const template_data = JSON.stringify(data);
        return this.http
            .post(`${this._url}/SendEmail?EmailTo=${email}&TemplateId=${template_id}&TemplateData=${template_data}`, {});
    }

    /**
     * Send a postal message through GOV.UK Notify.
     */
    sendLetter() { }

    /**
     * Send a text message (SMS) through GOV.UK Notify.
     */
    sendSMS(mobile: string, template_id: string, data: { [propKey: string]: string }) {
        // NOTE: A gotcha with this endpoint is that it takes GET style parameters instead of via POST.
        const template_data = JSON.stringify(data);
        return this.http
            .post(`${this._url}/SendSMS?MobileNumber=${mobile}&TemplateId=${template_id}&TemplateData=${template_data}`, {});
    }

    /**
     * Send a statement via email through GOV.UK Notify.
     */
    sendEmailStatement(parameters: INotifyStatementParameters) {
        const template_data = JSON.stringify(parameters.TemplateData);

        return this.http
            .post(`${this._url}/SendEmailPdfStatements` +
                `?EmailTo=${parameters.EmailTo}` +
                `&TenancyAgreementRef=${parameters.TenancyReference}` +
                `&TemplateId=${parameters.TemplateId}` +
                `&ContactId=${parameters.ContactId}` +
                `&StartDate=${parameters.StartDate}` +
                `&EndDate=${parameters.EndDate}` +
                `&TemplateData=${template_data}`, {});
    }


    /**
     * Organise the templates obtained from GOV.UK Notify into a grouped list.
     */
    _organiseTemplates(templates): CommsOption[] {
        const options: CommsOption[] = new Array<CommsOption>();

        // Group the templates by their name.
        templates.forEach(function(template: INotifyAPITemplate) {
            let option: CommsOption;
            const index = options.findIndex(function(existing_option: CommsOption) {
                // Do a case insensitive comparison.
                return existing_option.name.toLowerCase() === template.name.toLowerCase();
            });
            if (-1 === index) {
                // Create a new option and add it to the list.
                option = new CommsOption(template.name);
                options.push(option);
            } else {
                // Use an existing option.
                option = options[index];
            }
            // Add the template to the option.
            option.addTemplate(template.type, new CommsTemplate(template.id, template.subject, template.body, template.version));
        });

        this._sortOptions(options);

        return options;
    }

    /**
     * sort CommsOptions alphabetically.
     */
    _sortOptions(options: CommsOption[]) {
        options.sort(function(a: CommsOption, b: CommsOption) {
            const left = a.name.toLowerCase();
            const right = b.name.toLowerCase();

            if (left < right) {
                return -1;
            } else if (left > right) {
                return 1;
            }
            return 0;
        });

        return options;
    }

}
