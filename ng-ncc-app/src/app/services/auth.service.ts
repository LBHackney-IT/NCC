import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IAuthentication } from '../interfaces/authentication';
import { NCCAPIService } from '../API/NCCAPI/ncc-api.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private _user: IAuthentication = null;

    constructor(private NCCAPI: NCCAPIService) { }

    attempt(code: string): Observable<boolean> {
        return this.NCCAPI.authenticate(code)
            .pipe(
                map((data: IAuthentication) => {
                    this._user = data;
                    return this._user.success;
                })
            );
    }

    isLoggedIn(): boolean {
        return null !== this._user && this._user.success;
    }

    getUsername(): string {
        return this.isLoggedIn() ? this._user.username : null;
    }

    getMessage(): string {
        return this.isLoggedIn() ? this._user.message : null;
    }

}
