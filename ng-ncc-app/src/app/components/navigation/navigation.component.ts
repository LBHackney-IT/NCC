// NAVIGATION component.
// <app-navigation></app-navigation>

import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { CallService } from '../../services/call.service';

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {

    constructor(private Call: CallService, private router: Router) { }

    /**
     * "Ends" the current call and navigates to the log call page.
     */
    endCall() {
        this.Call.reset();
        this.router.navigateByUrl('/log-call');
    }
}
