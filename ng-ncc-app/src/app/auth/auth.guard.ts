import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { Route, Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    // This guard checks whether a user has logged in or not, and if a code is provided in the route parameters, attempts authentication.
    // It should prevent access to the respective route if there's no authenticated or logged in user.

    constructor(private Auth: AuthService, private router: Router) { }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

        const code = next.params.code;
        // console.log('AuthGuard#canActivate called with code:', code);

        if (this.Auth.isLoggedIn()) {
            // There's already a logged in user.
            // console.log('User is already logged in.', this.Auth.hasAccess());
            return this.Auth.hasAccess();
        }

        if (code) {
            // Attempt to confirm that a user is logged in. The Observable will return true or false based on success.
            // console.log('Authenticating...');
            return this.Auth.attempt(next.params.code)
                .pipe(
                    map((outcome: boolean) => {
                        // console.log('authenticated?', outcome, this.Auth.getMessage());
                        //
                        // if (outcome) {
                        //     console.log('has access:', this.Auth.hasAccess());
                        //     console.log('is a representative:', this.Auth.isAgent());
                        //     console.log('is a team leader:', this.Auth.isTeamLeader());
                        // }

                        // If the authentication was successful, redirect to the "last x calls" page.
                        // If unsuccessful, redirect to the "try again" page.
                        this.router.navigate([outcome ? '/last-calls' : '/try-again']);

                        return outcome;
                    }));
        } else if (environment.disable.authentication) {
            // console.log('Attempt to bypass authentication.');
            return this.Auth.bypass();
        }

        // No code or logged in user.
        // console.log('No code provided.');
        this.router.navigate(['/try-again']);
        return false;
    }
}
