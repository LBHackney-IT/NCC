import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { Route, Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PAGES } from '../constants/pages.constant';
import { AuthService } from '../services/auth.service';
import { ViewOnlyService } from '../services/view-only.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    // This guard checks whether a user has logged in or not, and if a code is provided in the route parameters, attempts authentication.
    // It should prevent access to the respective route if there's no authenticated or logged in user.

    constructor(private Auth: AuthService, private router: Router, private ViewOnly: ViewOnlyService) { }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

        if (this.Auth.isLoggedIn()) {
            // There's already a logged in user.
            return this.Auth.hasAccess();
        }

        const code = next.params.code;
        const isViewOnly = !!(next.params.viewonly); // whether set or not.

        if (code) {
            // Attempt to confirm that a user is logged in. The Observable will return true or false based on success.
            return this.Auth.attempt(code)
                .pipe(
                    map((outcome: boolean) => {
                        // If the authentication was successful, redirect to the "last x calls" page.
                        // If unsuccessful, redirect to the "try again" page.
                        this.router.navigate([outcome ? `/${PAGES.PREVIOUS_CALLS.route}` : `/${PAGES.TRY_AGAIN.route}`]);

                        this._setViewOnlyMode(isViewOnly);

                        return outcome;
                    }));
        } else {
            if (environment.disable.authentication) {
                // Attempt to bypass authentication, which won't work if the respective environment variable isn't set.
                const outcome = this.Auth.bypass();
                this._setViewOnlyMode(isViewOnly);
                return outcome;
            } else {
                // No authentication code: try redirecting to the authentication URL.
                window.location.href = environment.authenticationLink;
                return;
            }
        }

        // No logged in user.
        this.router.navigate([`/${PAGES.TRY_AGAIN.route}`]);
        return false;
    }

    /**
     * Enable or disable "view only" mode, based on the environment settings and whether the user can be in "view only" mode.
     */
    private _setViewOnlyMode(status: boolean) {
        this.ViewOnly.status = status && (!environment.disable.viewOnly && this.Auth.canViewOnly());
    }

}
