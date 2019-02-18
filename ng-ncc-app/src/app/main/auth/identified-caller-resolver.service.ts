// NOTE: this is actually a guard service.

import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

import { PAGES } from '../../common/constants/pages.constant';
import { CallService } from '../../common/services/call.service';

@Injectable()
export class IdentifiedCallerResolver implements Resolve<any[]> {

    constructor(private router: Router, private Call: CallService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {

        const caller = this.Call.getCaller();

        if (!(caller && !caller.isAnonymous())) {
            // We must have an identified caller to access this page.
            // Insetad, redirect to the Identify Caller page
            // (assuming the agent has selected a call type and reason).
            this.router.navigateByUrl(PAGES.IDENTIFY.route);
            return of([]);
        }

        return of(caller);
    }
}
