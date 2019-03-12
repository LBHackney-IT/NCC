import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { CallRevisionService } from 'src/app/common/services/call-revision.service';
import { ILastCall } from 'src/app/common/interfaces/last-call';
import { ManageATenancyAPIService } from 'src/app/common/API/ManageATenancyAPI/manageatenancy-api.service';
import { IAccountDetailsByReference } from 'src/app/common/interfaces/account-details-by-reference';

@Component({
    selector: 'app-call-revision-address',
    templateUrl: './call-revision-address.component.html',
    styleUrls: ['./call-revision-address.component.scss']
})
export class CallRevisionAddressComponent implements OnInit, OnDestroy {

    protected previousCall: ILastCall;
    protected accountDetails: IAccountDetailsByReference;

    private _destroy$ = new Subject<void>();

    constructor(private CallRevision: CallRevisionService, private ManageATenancyAPI: ManageATenancyAPIService) { }

    ngOnInit() {
        this.CallRevision.callSet
            .pipe(takeUntil(this._destroy$))
            .subscribe((previousCall: ILastCall) => {
                this.previousCall = previousCall;
                this.accountDetails = null;
                if (previousCall) {
                    this.ManageATenancyAPI.getAccountDetailsByReference(previousCall.housingref)
                        .pipe(take(1))
                        .subscribe((data: IAccountDetailsByReference) => {
                            this.accountDetails = data;
                        });
                }
            });
    }

    ngOnDestroy() {
        this._destroy$.next();
    }

    get address(): string {
        if (this.accountDetails) {
            const address = this.accountDetails.ListOfAddresses[0];
            return `${address.shortAddress} ${address.postCode}`.toUpperCase();
        }
        return null;
    }
}
