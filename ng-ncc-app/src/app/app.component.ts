// APP component.
// <app-root></app-root>

import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { initAll } from 'govuk-frontend';
import { Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { ContentAreaComponent } from './components/content-area/content-area.component';
import { AuthService } from './services/auth.service';
import { BackLinkService } from './services/back-link.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, OnDestroy {
    @ViewChild(ContentAreaComponent) private contentArea: ContentAreaComponent;
    // This is a reference to an <app-content-area> component within this component.

    loading = false;

    private _destroyed$ = new Subject();

    constructor(private router: Router, private Auth: AuthService, private BackLink: BackLinkService) {
        this.router.events
            .pipe(
                takeUntil(this._destroyed$)
                // i.e. continue the subscription until the _destroyed$ observable emits a value (see ngOnDestroy).
            )
            .subscribe((event: Event) => {
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

                        // By default disable (or hide) the back link.
                        this.BackLink.disable();
                        break;

                    case event instanceof NavigationCancel:
                    case event instanceof NavigationError:
                        // Navigation came to an end somehow.
                        this.loading = false;
                        break;
                }
            });
    }

    /**
     *
     */
    ngOnInit() {
        // initAll(); // initialise GOV.UK Frontend components.
    }

    /**
     *
     */
    ngOnDestroy() {
        this._destroyed$.next();
    }

    /**
     *
     */
    loggedIn(): boolean {
        return this.Auth.isLoggedIn();
    }

}
