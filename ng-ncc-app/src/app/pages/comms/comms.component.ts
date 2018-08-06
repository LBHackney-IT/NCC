import { Component, OnInit } from '@angular/core';
import { initAll } from 'govuk-frontend'

@Component({
    selector: 'app-page-comms',
    templateUrl: './comms.component.html',
    styleUrls: ['./comms.component.css']
})
export class PageCommsComponent implements OnInit {

    constructor() { }

    ngOnInit() {
        // Initialise the GOV.UK components on this page.
        initAll();
    }

}
