// NOTE: this is actually a guard service.

import { Injectable } from '@angular/core';
import { CanActivate, Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

import { PAGES } from '../../common/constants/pages.constant';
import { CallService } from '../../common/services/call.service';

@Injectable()
export class IsIdentifiedCallerGuard implements CanActivate {

    constructor(private router: Router, private Call: CallService) { }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

        const caller = this.Call.getCaller();
        const outcome = (caller && !caller.isAnonymous());

        if (!outcome) {
            // We must have an identified caller to access this page; redirect to the Identify Caller page.
            this.router.navigateByUrl(PAGES.IDENTIFY.route);
        }

        return outcome;
    }
}
