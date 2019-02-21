// NOTE: this is actually a guard service.

import { Injectable } from '@angular/core';
import { CanActivate, Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

import { PAGES } from '../../common/constants/pages.constant';
import { CallService } from '../../common/services/call.service';

@Injectable()
export class CallerCanMakePaymentGuard implements CanActivate {

    constructor(private router: Router, private Call: CallService) { }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

        const outcome = this.Call.isCallerIdentified() || this.Call.isCallerNonTenant();

        if (!outcome) {
            // We must have an identified or non-tenant caller to access this page.
            this.router.navigateByUrl(PAGES.IDENTIFY.route);
        }

        return outcome;
    }
}
