import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CommsOption } from '../classes/comms-option.class';
import { CommsTemplate } from '../classes/comms-template.class';
import { NotifyAPIService } from '../API/NotifyAPI/notify-api.service';
import { NotifyAPITemplate } from '../interfaces/notify-api-template.interface';
import { CONTACT } from '../constants/contact.constant';

@Injectable()
export class NotifyTemplatesResolver implements Resolve<CommsOption[]> {

    constructor(private NotifyAPI: NotifyAPIService, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CommsOption[]> {

        // forkJoin() is the Observable equivalent of Promise.all(), which is used to resolve multiple Observables before continuing.
        return forkJoin(
            this.NotifyAPI.getTemplates(CONTACT.METHOD_EMAIL),
            this.NotifyAPI.getTemplates(CONTACT.METHOD_POST),
            this.NotifyAPI.getTemplates(CONTACT.METHOD_SMS),
            (email, letter, sms) => {
                return this._organiseTemplates([].concat(email, letter, sms));
            }
        );

    }

    /**
     * Organise the templates obtained from GOV.UK Notify into a grouped list.
     */
    _organiseTemplates(templates: Array<NotifyAPITemplate>): CommsOption[] {
        const options: CommsOption[] = new Array<CommsOption>();

        // Group the templates by their name.
        templates.forEach(function(template: NotifyAPITemplate) {
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
