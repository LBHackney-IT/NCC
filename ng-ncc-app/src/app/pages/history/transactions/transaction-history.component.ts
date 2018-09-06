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
    filter_type: string;
    filter_settings: { [propKey: string]: string };

    constructor(private ManageATenancyAPI: ManageATenancyAPIService, private route: ActivatedRoute) { }

    /**
     *
     */
    ngOnInit() {
        this.filter_settings = {};
        this.route.data
            .subscribe((data) => {
                this.account_details = data.accountDetails;
            });
    }

    /**
     *
     */
    filterTransactions() {
        this.filter_settings = {
            debDesc: this.filter_type
        };
        console.log(this.filter_settings);
    }

}
