import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { CallService } from '../services/call.service';
import { IContactDetails } from '../interfaces/contact-details';
import { IdentifiedCaller } from '../classes/identified-caller.class';
import { NCCAPIService } from '../API/NCCAPI/ncc-api.service';

@Injectable()
export class ContactDetailsResolver implements Resolve<any[]> {

    constructor(private router: Router, private Call: CallService, private NCCAPI: NCCAPIService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {

        if (this.Call.hasCaller()) {
            const caller = this.Call.getCaller() as IdentifiedCaller;
            return this.NCCAPI.getContactDetails(caller.getContactID());
        } else {
            return null;
        }
    }
}
