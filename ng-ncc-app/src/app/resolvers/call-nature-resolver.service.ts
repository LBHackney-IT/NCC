// NOTE: this is actually a guard service.

import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

import { PAGES } from '../constants/pages.constant';
import { CallService } from '../services/call.service';

@Injectable()
export class CallNatureResolver implements Resolve<any[]> {

    constructor(private router: Router, private Call: CallService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any[]> {

        if (!this.Call.hasCallNature()) {
            // No call nature (type and reason) was set, so we redirect to the Log Call page.
            this.router.navigateByUrl(PAGES.LOG_CALL.route);
            return of([]);
        }
    }
}
