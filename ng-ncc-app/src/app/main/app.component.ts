// APP component.
// <app-root></app-root>

import { VERSION } from '../../environments/version';
import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Event, NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../common/services/auth.service';
import { BackLinkService } from '../common/services/back-link.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, OnDestroy {

    @ViewChild('content') contentArea: ElementRef;

    title = 'Hackney Neighbourhood Call Centre';
    loading = false;

    private _destroyed$ = new Subject();

    constructor(
        private router: Router,
        private Auth: AuthService,
        private BackLink: BackLinkService
    ) {
    }

    ngOnInit() {
        // This part handles the display of the route loading activity bar.
        this.router.events
            .pipe(
                takeUntil(this._destroyed$)
                // i.e. continue the subscription until the _destroyed$ observable emits a value (see ngOnDestroy).
            )
            .subscribe((event: Event) => {
                if (event instanceof NavigationEnd) {
                    // By default disable (or hide) the back link.
                    this.BackLink.disable();
                }
            });
    }

    ngOnDestroy() {
        this._destroyed$.next();
    }

    /**
     * Returns TRUE if there is a logged in user.
     */
    loggedIn(): boolean {
        return this.Auth.isLoggedIn();
    }

    jumpToContent() {
        this.contentArea.nativeElement.scrollIntoView();
        this.contentArea.nativeElement.focus();
        return false;
    }

    /**
     * Returns the current version number.
     */
    getVersion(): string {
        const tag_string = VERSION.tag ? ` (${VERSION.tag})` : '';
        return `version ${VERSION.version}${tag_string}`;
    }

}
