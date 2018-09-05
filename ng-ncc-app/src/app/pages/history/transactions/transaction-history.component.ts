import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AccountDetails } from '../../../interfaces/account-details.interface';
import { ManageATenancyAPIService } from '../../../API/ManageATenancyAPI/manageatenancy-api.service';

@Component({
    selector: 'app-transaction-history',
    templateUrl: './transaction-history.component.html',
    styleUrls: ['./transaction-history.component.scss']
})
export class PageTransactionHistoryComponent implements OnInit {

    account_details: AccountDetails;

    constructor(private ManageATenancyAPI: ManageATenancyAPIService, private route: ActivatedRoute) { }

    // TODO incorporate the filter into the transactions component.

    ngOnInit() {
        this.route.data
            .subscribe((data) => {
                this.account_details = data.accountDetails;
            });
    }

}
