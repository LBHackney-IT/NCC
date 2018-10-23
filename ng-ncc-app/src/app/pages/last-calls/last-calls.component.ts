import { environment } from '../../../environments/environment';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-last-calls',
    templateUrl: './last-calls.component.html',
    styleUrls: ['./last-calls.component.scss']
})
export class PageLastCallsComponent implements OnInit {

    call_count: number = environment.previousCallCount;

    constructor() { }

    ngOnInit() {
    }

}
