import { Component, OnInit } from '@angular/core';

import { PageTitleService } from '../../services/page-title.service';

@Component({
    selector: 'app-page-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class PageHomeComponent implements OnInit {

    constructor(private PageTitle: PageTitleService) { }

    ngOnInit() {
        this.PageTitle.set('Old Home');
    }

}
