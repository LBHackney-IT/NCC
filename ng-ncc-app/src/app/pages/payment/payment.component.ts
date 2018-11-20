import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs'
import { take, catchError } from 'rxjs/operators'

import { PAGES } from '../../constants/pages.constant';
import { CallService } from '../../services/call.service';

@Component({
    selector: 'app-payment',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.css']
})
export class PagePaymentComponent implements OnInit {

    error: boolean;
    page_defs = PAGES;

    constructor(private Call: CallService) { }

    ngOnInit() {
        this.Call.getAccount()
            .pipe(take(1))
            .subscribe(
                () => { },
                () => {
                    this.error = true;
                }
            );
    }

    isIdentifiedCaller(): boolean {
        return this.Call.isCallerIdentified();
    }

}
