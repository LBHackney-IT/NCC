import { Component, OnInit } from '@angular/core';

import { PAGES } from '../../constants/pages.constant';
import { PageCommunications } from '../abstract/communications';
import { PageTitleService } from '../../services/page-title.service';

@Component({
    selector: 'app-page-comms',
    templateUrl: './comms.component.html',
    styleUrls: ['./comms.component.css']
})
export class PageCommsComponent extends PageCommunications implements OnInit {

    ngOnInit() {
        super.ngOnInit();
        this.PageTitle.set(PAGES.COMMS.label);
    }
}
