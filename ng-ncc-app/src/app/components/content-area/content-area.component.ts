import { Component, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Component({
    selector: 'app-content-area',
    templateUrl: './content-area.component.html',
    styleUrls: ['./content-area.component.scss']
})

/**
 * This component serves as the scrollable content area for the app.
 * We had this component so we could communicate with child components (namely <app-note-form/>) when the content area is scrolled.
 * https://embed.plnkr.co/6TslzP/
 */
export class ContentAreaComponent { }
