import { Component } from '@angular/core';

import { PAGES } from '../../constants/pages.constant';
import { CallService } from '../../services/call.service';

@Component({
    selector: 'app-payment',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.css']
})
export class PagePaymentComponent {

    page_defs = PAGES;

    constructor(private Call: CallService) { }

    isIdentifiedCaller(): boolean {
        return this.Call.isCallerIdentified();
    }

}
