import { environment } from '../../../environments/environment';
import { Component, OnInit } from '@angular/core';

import { PAGES } from '../../constants/pages.constant';
import { PageTitleService } from '../../services/page-title.service';

@Component({
    selector: 'app-last-calls',
    templateUrl: './last-calls.component.html',
    styleUrls: ['./last-calls.component.scss']
})
export class PageLastCallsComponent implements OnInit {

    call_count: number = environment.previousCallCount;

    constructor(private PageTitle: PageTitleService) { }

    ngOnInit() {
        this.PageTitle.set(PAGES.PREVIOUS_CALLS.label);
    }
}
