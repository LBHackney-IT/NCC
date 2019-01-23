import { Component, Input, OnChanges } from '@angular/core';
import { take } from 'rxjs/operators';

import { NCCAPIService } from '../../API/NCCAPI/ncc-api.service';
import { IAccountDetails } from '../../interfaces/account-details';
import { IRentBreakdown } from '../../interfaces/rent-breakdown';

@Component({
    selector: 'app-rent-breakdown',
    templateUrl: './rent-breakdown.component.html',
    styleUrls: ['./rent-breakdown.component.scss']
})
export class RentBreakdownComponent implements OnChanges {
    @Input() account: IAccountDetails;

    rows: IRentBreakdown[];

    constructor(private NCCAPI: NCCAPIService) { }

    ngOnChanges() {
        if (this.account) {
            this.NCCAPI.getRentBreakdown(this.account.tagReferenceNumber)
                .pipe(take(1))
                .subscribe((data) => {
                    this.rows = data;
                });
        }
    }

}
