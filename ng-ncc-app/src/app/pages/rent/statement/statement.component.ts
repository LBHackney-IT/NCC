import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-rent-statement',
    templateUrl: './statement.component.html',
    styleUrls: ['./statement.component.scss']
})
export class PageRentStatementComponent implements OnInit {

    from_date: string = '13/08/2017';
    until_date: string = '15/08/2018';

    constructor() { }

    ngOnInit() {
    }

}
