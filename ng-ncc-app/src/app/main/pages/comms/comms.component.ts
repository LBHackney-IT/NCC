import { Component, OnInit } from '@angular/core';

import { PAGES } from '../../../common/constants/pages.constant';
import { PageCommunications } from '../abstract/communications';
import { PageTitleService } from '../../../common/services/page-title.service';

@Component({
    selector: 'app-page-comms',
    templateUrl: './comms.component.html',
    styleUrls: ['./comms.component.css']
})
export class PageCommsComponent extends PageCommunications implements OnInit {

    /**
     *
     */
    ngOnInit() {
        super.ngOnInit();
        this.PageTitle.set(PAGES.COMMS.label);
    }

    /**
     *
     */
    commsSuccess() {
        this.resetComms();
    }

    /**
     *
     */
    getRentPageRoute(): string {
        return `/${PAGES.RENT.route}`;
    }

    /**
     *
     */
    isRentLinkVisible(): boolean {
        return this.Call.isCallerIdentified() || this.Call.isCallerNonTenant();
    }

}
