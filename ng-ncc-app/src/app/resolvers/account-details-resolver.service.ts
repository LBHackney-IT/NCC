import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { CallService } from '../services/call.service';
import { IdentifiedCaller } from '../classes/identified-caller.class';
import { ManageATenancyAPIService } from '../API/ManageATenancyAPI/manageatenancy-api.service';

@Injectable()
export class AccountDetailsResolver implements Resolve<any[]> {

    constructor(private router: Router, private Call: CallService, private ManageATenancyAPI: ManageATenancyAPIService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const caller = this.Call.getCaller() as IdentifiedCaller;
        if (caller && !caller.isAnonymous()) {
            // Fetch the account details for the caller.
            return this.ManageATenancyAPI.getAccountDetails(caller.getContactID());
        } else {
            console.log('No caller to fetch details for.');
            return of(null);
        }
    }
}
