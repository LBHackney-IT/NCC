import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { NotifyTemplate } from '../classes/notify-template.class';
import { NotifyAPIService } from '../API/NotifyAPI/notify-api.service';
import { CONTACT } from '../constants/contact.constant';

@Injectable()
export class NotifyTemplatesResolver implements Resolve<NotifyTemplate[]> {

    constructor(private NotifyAPI: NotifyAPIService, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<NotifyTemplate[]> {

        // forkJoin() is the Observable equivalent of Promise.all(), which is used to resolve multiple Observables before continuing.
        return forkJoin(
            this.NotifyAPI.getTemplates(CONTACT.METHOD_EMAIL),
            this.NotifyAPI.getTemplates(CONTACT.METHOD_POST),
            this.NotifyAPI.getTemplates(CONTACT.METHOD_SMS),
            (email, letter, sms) => {
                return [].concat(email, letter, sms);
            }
        );

    }
}
