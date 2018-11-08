import { Component } from '@angular/core';

import { PAGES } from '../../../constants/pages.constant';
import { PagePaymentMakeComponent } from '../../payment/make/payment-make.component';
import { PageTitleService } from '../../../services/page-title.service';

@Component({
    selector: 'app-failed',
    templateUrl: './failed.component.html',
    styleUrls: ['./failed.component.scss']
})
export class PageTransactionFailedComponent extends PagePaymentMakeComponent {

}
