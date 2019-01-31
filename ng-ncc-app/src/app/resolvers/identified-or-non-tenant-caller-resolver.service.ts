// NOTE: this is actually a guard service.

import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

import { PAGES } from '../constants/pages.constant';
import { CallService } from '../services/call.service';

@Injectable()
export class IdentifiedOrNonTenantCallerResolver implements Resolve<any[]> {

    constructor(private router: Router, private Call: CallService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {

        const caller = this.Call.getCaller();

        // We must have an identified or non-tenant caller to access this page.
        if (this.Call.isCallerIdentified() || this.Call.isCallerNonTenant()) {
            return of(caller);
        }

        // We don't have one...
        // Instead, redirect to the Identify Caller page (assuming the agent has selected a call type and reason).
        this.router.navigateByUrl(PAGES.IDENTIFY.route);
        return of([]);

    }
}
