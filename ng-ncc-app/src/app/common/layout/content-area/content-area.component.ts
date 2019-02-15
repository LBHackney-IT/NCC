import { Component } from '@angular/core';

/**
* This component serves as the scrollable content area for the app.
* We had this component so we could communicate with child components (namely <app-note-form/>) when the content area is scrolled.
* https://embed.plnkr.co/6TslzP/
*/

@Component({
    selector: 'app-layout-content',
    templateUrl: './content-area.component.html',
    styleUrls: ['./content-area.component.scss']
})
export class LayoutContentComponent { }
