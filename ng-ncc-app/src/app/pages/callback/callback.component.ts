import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-page-callback',
    templateUrl: './callback.component.html',
    styleUrls: ['./callback.component.scss']
})
export class PageCallbackComponent implements OnInit {

    recipient: string;  // Recipient or Officer email address.
    teamLeader: string; // Team leader or Manager email address.

    constructor() { }

    ngOnInit() {
    }

}
