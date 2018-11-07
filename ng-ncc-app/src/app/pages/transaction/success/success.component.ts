import { Component, Injector, OnInit } from '@angular/core';

import { IParisResponse } from '../../../interfaces/paris-response';
import { CallService } from '../../../services/call.service';
import { TransactionService } from '../../../services/transaction.service';
import { PageCommunications } from '../../abstract/communications';

@Component({
    selector: 'app-success',
    templateUrl: './success.component.html',
    styleUrls: ['./success.component.scss']
})
export class PageTransactionSuccessComponent extends PageCommunications implements OnInit {

    data: IParisResponse;

    Transaction: TransactionService;

    constructor(private injector: Injector) {
        super(injector);
        this.Transaction = this.injector.get(TransactionService);
    }

    ngOnInit() {
        super.ngOnInit();
        this.data = this.Transaction.data;
        console.log(this.data);
    }

    /**
     *
     */
    getCallerName(): string {
        return this.Call.getCaller().getName();
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
