import { Component } from '@angular/core';

import { PagePaymentMakeComponent } from '../../payment/make/payment-make.component';

@Component({
    selector: 'app-failed',
    templateUrl: './failed.component.html',
    styleUrls: ['./failed.component.scss']
})
export class PageTransactionFailedComponent extends PagePaymentMakeComponent { }
