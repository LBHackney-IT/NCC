// This component fetches information from the NCC API to display a tenancy's current balance.
// The current balance is calculated by the API.

import { Component, Input, OnChanges } from '@angular/core';
import { take } from 'rxjs/operators';

import { NCCAPIService } from '../../../common/API/NCCAPI/ncc-api.service';
import { ITenancyAgreementDetails } from '../../../common/interfaces/tenancy-agreement-details';

@Component({
    selector: 'app-current-balance',
    templateUrl: './current-balance.component.html',
    styleUrls: ['./current-balance.component.scss']
})
export class CurrentBalanceComponent implements OnChanges {

    @Input() tenancyReference: string;

    details: ITenancyAgreementDetails;

    constructor(private NCCAPI: NCCAPIService) { }

    ngOnChanges() {
        if (this.tenancyReference) {
            this.NCCAPI.getTenancyAgreementDetails(this.tenancyReference)
                .pipe(take(1))
                .subscribe(
                    (details: ITenancyAgreementDetails) => {
                        this.details = details;
                    }
                );
        }
    }

}
