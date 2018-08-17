import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, of, from } from 'rxjs';

import { NotifyAPIJSONResult } from '../../interfaces/notify-api-json-result.interface';

@Injectable({
    providedIn: 'root'
})

/**
 * NotifyService
 * This service is intended to provide access to the GOV.UK Notify API.
 */
export class NotifyAPIService {

    _url: string;

    constructor(private http: HttpClient) {
        this._url = 'http://lbhwebapit01:2020/api/GovNotifier';
    }

    /**
     * Returns a list of GOV.UK Notify templates.
     */
    getTemplates(ofType: string) {
        // TODO confirm the type of template requested.
        // TODO the endpoint doesn't support fetching all templates (optional template type).
        return this.http
            .get(this._url + '/GetAllTemplates?TemplateType=' + ofType)
            .pipe(
                map((data: NotifyAPIJSONResult) => {
                    // Prepare the data returned from the microservice as a list of templates.
                    const templates: Array<object> = Array.from(data.response.templates);

                    return templates;
                },
                    (error) => {
                        console.log('Error fetching templates:', error);
                    })
            );
    }

    /**
     * Returns a preview of a specified GOV.UK Notify template.
     */
    getTemplatePreview(template_id: string, version: number = 1) {
        return this.http
            .get(this._url + '/GetTemplateByIdAndVersion?TemplateId=' + template_id + '&Version=' + version)
            .pipe(
                map((data: NotifyAPIJSONResult) => {
                    const template_body: string = data.response.body;
                    // TODO pass additional parameters to this method and replace placeholders with data.

                    return template_body;
                })
            );
    }

    /**
     * Send an email message through GOV.UK Notify.
     */
    sendEmail(email: string, template_id: string, data: any) {
        const template_data: string = JSON.stringify(data);
        return this.http
            .post(`${this._url}/SendEmail`, {
                EmailTo: email,
                TemplateId: template_id,
                TemplateData: JSON.stringify(data)
            })
            .pipe(
                map(
                    (result: NotifyAPIJSONResult) => {
                        // TODO: what do we return?
                        console.log(result);
                        return true;
                    }
                )
            );
    }

    /**
     * Send a postal message through GOV.UK Notify.
     */
    sendLetter() { }

    /**
     * Send a text message (SMS) through GOV.UK Notify.
     */
    sendSMS(mobile: string, template_id: string, data: any) {
        if (!(mobile && template_id)) {
            return;
        }
        return this.http
            .post(`${this._url}/SendSMS`, {
                MobileNumber: mobile,
                TemplateId: template_id,
                TemplateData: encodeURIComponent(JSON.stringify(data))
            })
            .pipe(
                map(
                    (result: NotifyAPIJSONResult) => {
                        // TODO: what do we return?
                        console.log(result);
                        return true;
                    }
                )
            );

    }
}
