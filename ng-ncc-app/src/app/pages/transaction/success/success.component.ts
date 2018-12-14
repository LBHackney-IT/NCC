import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PAGES } from '../../../constants/pages.constant';
import { IParisResponse } from '../../../interfaces/paris-response';
import { CallService } from '../../../services/call.service';
import { TransactionService } from '../../../services/transaction.service';
import { PageCommunications } from '../../abstract/communications';
import { PageTitleService } from '../../../services/page-title.service';

@Component({
    selector: 'app-success',
    templateUrl: './success.component.html',
    styleUrls: ['./success.component.scss']
})
export class PageTransactionSuccessComponent extends PageCommunications implements OnInit {

    data: IParisResponse;

    PageTitle: PageTitleService;
    router: Router;
    Transaction: TransactionService;

    constructor(private injector: Injector) {
        super(injector);
        this.PageTitle = this.injector.get(PageTitleService);
        this.router = this.injector.get(Router);
        this.Transaction = this.injector.get(TransactionService);

        this.PageTitle.set(PAGES.TRANSACTION_SUCCESS.label);
    }

    /**
     *
     */
    ngOnInit() {
        super.ngOnInit();
        this.data = this.Transaction.data;
    }

    /**
     *
     */
    getCallerName(): string {
        return this.Call.isCallerIdentified() ? this.Call.getCaller().getName() : 'anonymous';
    }

    /**
     *
     */
    isTestPayment(): boolean {
        return this.data && this.data.receiptnumber.match(/^NET2.*/);
    }

    /**
     *
     */
    updatePreview() {
        super.updatePreview();
        if (this.shouldShowPreview()) {
            this.preview.parameters = {
                amount: this.data.amount,
                date: this.data.date,
                'payment ref': this.data.receiptnumber
            };
        }
    }

    /**
     *
     */
    returnToPayment() {
        // Go (back?) to the rent payment page.
        this.router.navigate([`${PAGES.RENT.route}/${PAGES.RENT_PAYMENT.route}`]);
    }

}
