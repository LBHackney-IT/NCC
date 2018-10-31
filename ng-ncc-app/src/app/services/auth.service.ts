import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AUTH } from '../constants/auth.constant';
import { IAuthentication } from '../interfaces/authentication';
import { NCCAPIService } from '../API/NCCAPI/ncc-api.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private _user: IAuthentication = null;

    constructor(private NCCAPI: NCCAPIService) { }

    /**
     * Attempt to authenticate a user, using the specified code.
     */
    attempt(code: string): Observable<boolean> {
        return this.NCCAPI.authenticate(code)
            .pipe(
                map((data: IAuthentication) => {
                    if (data.success) {
                        console.log('Successfully logged in as', data.username);
                    }

                    // Whatever the outcome of the authentication attempt, we store the data locally.
                    this._user = data;
                    return this._user.success;
                })
            );
    }

    /**
     * Attempt to bypass authenticatication, useful for testing.
     */
    bypass() {
        if (environment.disable.authentication) {
            // Create a dummy agent.
            this.set({
                fullname: 'Unknown NCC Agent',
                userid: '123456',
                username: 'unknown.nccagent',
                useremail: 'unknown@localhost',
                success: true,
                message: null,
                roles: [
                    AUTH.ROLE_ACCESS,
                    AUTH.ROLE_AGENT
                ]
            } as IAuthentication);
            return true;
        }

        throw new Error('Bypassing authentication is not allowed.');
    }

    /**
     * Returns TRUE if we have data as a result of an authentication attempt.
     */
    set(user: IAuthentication) {
        this._user = user;
    }

    /**
     * Returns TRUE if we have data as a result of an authentication attempt.
     */
    hasData(): boolean {
        return null !== this._user;
    }

    /**
     * Returns TRUE if a user has been logged in successfully.
     */
    isLoggedIn(): boolean {
        return this.hasData() && this._user.success;
    }

    /**
    * Returns the username of the currently logged in user.
     */
    getUsername(): string {
        return this.isLoggedIn() ? this._user.username : null;
    }

    /**
    * Returns the full name of the currently logged in user.
     */
    getFullName(): string {
        return this.isLoggedIn() ? this._user.fullname : null;
    }

    /**
    * Returns the message given as a result of logging in.
     */
    getMessage(): string {
        return this.hasData() ? this._user.message : null;
    }

    /**
     * Returns TRUE if there is a logged in user and they have access to the app.
     */
    hasAccess(): boolean {
        return this._hasRole(AUTH.ROLE_ACCESS);
    }

    /**
    * Returns TRUE if there is a logged in user and they are an NCC customer service representative.
     */
    isAgent(): boolean {
        return this._hasRole(AUTH.ROLE_AGENT);
    }

    /**
     * Returns TRUE if there is a logged in user and they are an NCC Team Leader.
     */
    isTeamLeader(): boolean {
        return this._hasRole(AUTH.ROLE_TEAM_LEADER);
    }

    /**
     * Returns TRUE if there is a logged in user and they have the specified role.
     */
    _hasRole(role: string): boolean {
        return this.hasData() && -1 !== this._user.roles.indexOf(role);
    }

}
