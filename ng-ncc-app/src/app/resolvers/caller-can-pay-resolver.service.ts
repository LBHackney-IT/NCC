import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

import { PAGES } from '../constants/pages.constant';
import { CallService } from '../services/call.service';

@Injectable()
export class CallerCanPayResolver implements Resolve<any[]> {

    constructor(private router: Router, private Call: CallService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {

        const outcome = this.Call.isCallerIdentified() || this.Call.isCallerNonTenant();

        if (!outcome) {
            console.log('We must have an identified or non-tenant caller to access this page.');
            this.router.navigateByUrl(PAGES.IDENTIFY.route);
            return of([]);
        }

        return of(this.Call.getCaller());
    }
}
