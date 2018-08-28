// APP component.
// <app-root></app-root>

import { Component, OnInit } from '@angular/core';
import { initAll } from 'govuk-frontend';
import { Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
    title = 'Neighbourhood Call Centre (NCC) CRM';
    loading = false;

    constructor(private router: Router) {
        this.router.events.subscribe((event: Event) => {
            switch (true) {
                case event instanceof NavigationStart: {
                    // Started navigating to a route.
                    this.loading = true;
                    break;
                }

                case event instanceof NavigationEnd:
                case event instanceof NavigationCancel:
                case event instanceof NavigationError:
                    // Navigation came to an end somehow.
                    this.loading = false;
                    break;
            }
        });
    }

    ngOnInit() {
        initAll(); // initialise GOV.UK Frontend components.
    }

}
