import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-failed',
    templateUrl: './failed.component.html',
    styleUrls: ['./failed.component.scss']
})
export class PageTransactionFailedComponent implements OnInit {

    constructor() { }

    ngOnInit() {
        console.log('AYO');
    }

}
