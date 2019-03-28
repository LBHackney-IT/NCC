import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { PAGES } from '../../../common/constants/pages.constant';
import { PageHistory } from '../abstract/history';
import { NotesService } from '../../../common/services/notes.service';
import { PageTitleService } from '../../../common/services/page-title.service';
import { NOTES } from 'src/app/common/constants/notes.constant';

export abstract class PageNotes extends PageHistory implements OnInit {

    tenants_list: string[];
    note_type_list: string[] = [];
    filter: {
        min_date: Date | null,
        max_date: Date | null,
        manual: { [propKey: string]: string }
    };
    filter_tenant: string;
    filter_search_input: string;
    filter_note_type: string;

    route: ActivatedRoute;
    Notes: NotesService;
    PageTitle: PageTitleService;

    constructor(private injector: Injector) {
        super();
        this.route = this.injector.get(ActivatedRoute);
        this.Notes = this.injector.get(NotesService);
        this.PageTitle = this.injector.get(PageTitleService);
    }

    /**
     *
     */
    ngOnInit() {
        this.PageTitle.set(PAGES.VIEW_NOTES.label);

        // Retrieve a list of tenants (for the filter).
        this.getTenants()
            .pipe(take(1))
            .subscribe((list: string[]) => {
                this.tenants_list = list;
            });

        // Clear the notes filter.
        this.clearFilter();
    }

    /**
     * Fetches a list of tenant names associated with the specified tenancy reference.
     */
    abstract getTenants(): Observable<string[]>;

    /**
     * Returns the tenancy reference to fetch notes for.
     */
    abstract getTenancyReference(): string;

    /**
     * Set the manual filtering options for the list of notes.
     */
    filterNotes() {
        this.filter.manual = {
            callReasonType: this.filter_reason,
            clientName: this.filter_tenant
        };
    }

    /**
     * Clears/resets the notes filter settings.
     */
    clearFilter() {
        this.filter = {
            min_date: null,
            max_date: null,
            manual: {}
        };
        this.filter_reason = null;
        this.filter_tenant = null;
        this.filterNotes();
        this.filterByDate();
    }

}
