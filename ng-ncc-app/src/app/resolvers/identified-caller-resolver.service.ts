import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

import { PAGES } from '../constants/pages.constant';
import { CallService } from '../services/call.service';

@Injectable()
export class IdentifiedCallerResolver implements Resolve<any[]> {

    constructor(private router: Router, private Call: CallService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {

        const caller = this.Call.getCaller();

        if (!(caller && !caller.isAnonymous())) {
            console.log('We must have an identified caller to access this page.');
            this.router.navigateByUrl(PAGES.IDENTIFY.route);
            return of([]);
        }

        return of(caller);
    }
}
