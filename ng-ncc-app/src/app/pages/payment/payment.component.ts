import { Component } from '@angular/core';

import { PAGES } from '../../constants/pages.constant';

@Component({
    selector: 'app-payment',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.css']
})
export class PagePaymentComponent {

    page_defs = PAGES;

}
