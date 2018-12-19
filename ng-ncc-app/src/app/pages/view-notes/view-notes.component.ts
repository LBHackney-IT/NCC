import { Component, Injector, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PAGES } from '../../constants/pages.constant';
import { PageNotes } from '../abstract/notes';
import { IdentifiedCaller } from '../../classes/identified-caller.class';
import { CallService } from '../../services/call.service';
import { PageTitleService } from '../../services/page-title.service';

@Component({
    selector: 'app-view-notes',
    templateUrl: './view-notes.component.html',
    styleUrls: ['./view-notes.component.scss']
})
export class PageViewNotesComponent extends PageNotes implements OnInit {

    caller: IdentifiedCaller;

    constructor(private injectorObj: Injector, private Call: CallService) {
        super(injectorObj);
    }

    /**
     *
     */
    ngOnInit() {
        super.ngOnInit();
        this.PageTitle.set(PAGES.VIEW_NOTES.label);
    }

    isInCall(): boolean {
        return this.Call.hasCaller();
    }

    /**
     * Fetches a list of tenant names associated with the specified tenancy reference.
     */
    getTenants(): Observable<string[]> {
        const tenants = this.Call.getTenants();
        const tenant_names = tenants.map((tenant) => tenant.full_name);

        return of(tenant_names);
    }

    /**
     * Returns the tenancy reference to fetch notes for.
     */
    getTenancyReference(): string {
        return this.Call.getTenancyReference();
    }

}
