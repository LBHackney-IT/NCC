import { Component, Injector, OnInit } from '@angular/core';

import { PAGES } from '../../../constants/pages.constant';
import { PagePaymentMakeComponent } from '../../payment/make/payment-make.component';
import { PageTitleService } from '../../../services/page-title.service';
import { TransactionService } from '../../../services/transaction.service';

@Component({
    selector: 'app-failed',
    templateUrl: './failed.component.html',
    styleUrls: ['./failed.component.scss']
})
export class PageTransactionFailedComponent extends PagePaymentMakeComponent implements OnInit {

    Transaction: TransactionService;

    constructor(private injector: Injector) {
        super(injector);
        this.Transaction = this.injector.get(TransactionService);
    }

    ngOnInit() {
        super.ngOnInit();
        this.PageTitle.set(PAGES.TRANSACTION_FAILED.label);
        console.log(this.Transaction.data ? this.Transaction.data.error : 'no transaction data.');
    }
}
