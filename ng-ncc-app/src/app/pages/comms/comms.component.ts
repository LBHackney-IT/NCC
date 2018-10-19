import { Component, OnInit } from '@angular/core';
import { PageCommunications } from '../abstract/communications';

@Component({
    selector: 'app-page-comms',
    templateUrl: './comms.component.html',
    styleUrls: ['./comms.component.css']
})
export class PageCommsComponent extends PageCommunications {
}
