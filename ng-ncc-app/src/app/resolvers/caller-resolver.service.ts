import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

import { PAGES } from '../constants/pages.constant';
import { CallService } from '../services/call.service';

@Injectable()
export class CallerResolver implements Resolve<any[]> {

    constructor(private router: Router, private Call: CallService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {

        if (!this.Call.hasCaller()) {
            console.log('We must have a caller to access this page.');
            this.router.navigateByUrl(PAGES.IDENTIFY.route);
            return of([]);
        }

        return of(this.Call.getCaller());
    }
}
