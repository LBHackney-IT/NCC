import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { CallService } from '../services/call.service';
import { ContactDetails } from '../interfaces/contact-details.interface';
import { IdentifiedCaller } from '../classes/identified-caller.class';
import { ManageATenancyAPIService } from '../API/ManageATenancyAPI/manageatenancy-api.service';

@Injectable()
export class ContactDetailsResolver implements Resolve<any[]> {

    constructor(private router: Router, private Call: CallService, private ManageATenancy: ManageATenancyAPIService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {

        if (this.Call.hasCaller()) {
            const caller = this.Call.getCaller() as IdentifiedCaller;
            return this.ManageATenancy.getContactDetails(caller.getContactID());
        } else {
            return null;
        }
    }
}
