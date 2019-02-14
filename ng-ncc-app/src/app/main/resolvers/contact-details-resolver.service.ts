import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { CallService } from '../../common/services/call.service';
import { IContactDetails } from '../../common/interfaces/contact-details';
import { IdentifiedCaller } from '../../common/classes/identified-caller.class';
import { NCCAPIService } from '../../common/API/NCCAPI/ncc-api.service';

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
