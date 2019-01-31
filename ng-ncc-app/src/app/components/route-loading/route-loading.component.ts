import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// https://www.amadousall.com/angular-routing-how-to-display-a-loading-indicator-when-navigating-between-routes/

@Component({
    selector: 'app-route-loading',
    templateUrl: './route-loading.component.html',
    styleUrls: ['./route-loading.component.scss']
})
export class RouteLoadingComponent implements OnInit, OnDestroy {

    loading: boolean;

    private _destroyed$ = new Subject();

    constructor(private router: Router) { }

    ngOnInit() {
        this.router.events
            .pipe(takeUntil(this._destroyed$))
            // i.e. continue the subscription until the _destroyed$ observable emits a value (see ngOnDestroy).
            .subscribe((event: Event) => {
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

    ngOnDestroy() {
        this._destroyed$.next();
    }

}
