import { Component, OnInit } from '@angular/core';

import { PAGES } from '../../../common/constants/pages.constant';
import { PageCommunications } from '../abstract/communications';
import { take } from '../../../../../node_modules/rxjs/operators';

@Component({
    selector: 'app-page-comms',
    templateUrl: './comms.component.html',
    styleUrls: ['./comms.component.css']
})
export class PageCommsComponent extends PageCommunications implements OnInit {
    isLeasehold: boolean;

    /**
     *
     */
    ngOnInit() {
        super.ngOnInit();
        this.PageTitle.set(PAGES.COMMS.label);

        // Find out whether this account is for a leasehold property.
        this.route.data
            .pipe(take(1))
            .subscribe(
                (data: { isLeasehold: boolean }) => {
                    this.isLeasehold = data.isLeasehold;
                },
                () => { this.isLeasehold = false; }
            );
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
