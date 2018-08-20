import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-back-link-confirm',
    templateUrl: './back-link-confirm.component.html',
    styleUrls: ['./back-link-confirm.component.css']
})
export class BackLinkConfirmComponent {

    show: boolean;

    constructor(private router: Router) { }

    /**
     * Display the confirmation dialogue.
     */
    confirm(event: UIEvent) {
        event.preventDefault();
        this.show = true;
    }

    /**
     * Called if the user wants to stay on the page.
     */
    confirmedStay() {
        console.log('Stay.');
    }

    /**
     * Called if the user wants to leave.
     */
    confirmedLeave() {
        console.log('Go back.');
        this.router.navigateByUrl('home'); // to whatever is set as the "home" page.
    }

}
