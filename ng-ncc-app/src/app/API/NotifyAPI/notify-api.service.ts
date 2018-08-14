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
                })
            );
    }

    /**
     * Returns a preview of a specified GOV.UK Notify template.
     */
    getTemplatePreview() {

    }

    /**
     * Send an email message through GOV.UK Notify.
     */
    sendEmail() { }

    /**
     * Send a postal message through GOV.UK Notify.
     */
    sendLetter() { }

    /**
     * Send a text message (SMS) through GOV.UK Notify.
     */
    sendSMS() { }

}
