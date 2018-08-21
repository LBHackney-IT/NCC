import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { CallService } from '../services/call.service';

@Injectable()
export class CallNatureResolver implements Resolve<any[]> {

    constructor(private router: Router, private Call: CallService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any[]> {

        if (!this.Call.hasCallNature()) {
            console.log('We must have a call type and reason to access this page.');
            this.router.navigateByUrl('log-call');
            return of([]);
        }
    }
}
