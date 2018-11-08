import { Component, Injector, OnInit } from '@angular/core';

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

    Transaction: TransactionService;
    PageTitle: PageTitleService;

    constructor(private injector: Injector) {
        super(injector);
        this.Transaction = this.injector.get(TransactionService);
        this.PageTitle = this.injector.get(PageTitleService);

        this.PageTitle.set(PAGES.TRANSACTION_SUCCESS.label);
    }

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
    updatePreview() {
        super.updatePreview();
        if (this.shouldShowPreview()) {
            this.preview.parameters = {
                amount: this.data.amount,
                date: this.data.date,
                'payment ref': this.data.receiptnumber
            };
            console.log('parameters:', this.preview.parameters);
        }
    }

}
