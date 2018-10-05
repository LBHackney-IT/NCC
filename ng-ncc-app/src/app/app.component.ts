// APP component.
// <app-root></app-root>

import { Component, OnInit, ViewChild } from '@angular/core';
import { initAll } from 'govuk-frontend';
import { Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { ContentAreaComponent } from './components/content-area/content-area.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
    @ViewChild(ContentAreaComponent) private contentArea: ContentAreaComponent;
    // This is a reference to an <app-content-area> component within this component.

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
                    // Scroll the content area to the top of its content.
                    this.contentArea.scrollToTop();
                    this.loading = false;
                    break;

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
