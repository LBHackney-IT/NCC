// APP component.
// <app-root></app-root>

import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnDestroy {

    @ViewChild('content') contentArea: ElementRef;

    loading = false;

    private _destroyed$ = new Subject();

    constructor(private router: Router) {
        // This part handles the display of the route loading activity bar.
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

    ngOnDestroy() {
        this._destroyed$.next();
    }

    /**
     *
     */
    jumpToContent(event) {
        this.contentArea.nativeElement.scrollIntoView();
        this.contentArea.nativeElement.focus();
        return false;
    }

}
