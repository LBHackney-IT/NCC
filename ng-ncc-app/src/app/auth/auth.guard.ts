import { Injectable } from '@angular/core';
import { Route, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private Auth: AuthService) { }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        const code = next.params.code;
        console.log('AuthGuard#canActivate called with code:', code);

        if (this.Auth.isLoggedIn()) {
            // There's already a logged in user, so we're good.
            console.log('User is logged in.');
            return true;
        }

        if (code) {
            // Attempt to confirm that a user is logged in. The Observable will return true or false based on success.
            console.log('Authenticating...');
            return this.Auth.attempt(next.params.code)
                .pipe(
                    map((outcome: boolean) => {
                        console.log('authenticated?', outcome, this.Auth.getMessage());
                        return outcome;
                    }));
        }

        // No code or logged in user.
        console.log('No code provided.');
        return false;
    }
}
