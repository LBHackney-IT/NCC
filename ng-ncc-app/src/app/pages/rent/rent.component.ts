import { Component } from '@angular/core';

import { PAGES } from '../../constants/pages.constant';
import { CallService } from '../../services/call.service';

@Component({
    selector: 'app-rent',
    templateUrl: './rent.component.html',
    styleUrls: ['./rent.component.css']
})
export class PageRentComponent {

    page_defs = PAGES;

    constructor(private Call: CallService) { }

    isIdentifiedCaller(): boolean {
        return this.Call.isCallerIdentified();
    }

}
