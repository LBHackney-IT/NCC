import { Component, OnInit } from '@angular/core';

import { PAGES } from '../../../../common/constants/pages.constant';
import { PageTitleService } from '../../../../common/services/page-title.service';
import { TransactionService } from '../../../../common/services/transaction.service';

@Component({
    selector: 'app-error',
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.scss']
})
export class PageTransactionErrorComponent implements OnInit {

    constructor(private PageTitle: PageTitleService, private Transaction: TransactionService) { }

    ngOnInit() {
        this.PageTitle.set(PAGES.TRANSACTION_ERROR.label);
    }

    getErrorMessage(): string {
        return this.Transaction.data.error;
    }

}
