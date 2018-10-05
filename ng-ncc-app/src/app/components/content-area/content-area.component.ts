import { Component, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Component({
    selector: 'app-content-area',
    templateUrl: './content-area.component.html',
    styleUrls: ['./content-area.component.scss']
})

/**
 * This component serves as the scrollable content area for the app.
 * We have this component so we can communicate with child components (namely <app-note-form/>) when the content area is scrolled.
 * https://embed.plnkr.co/6TslzP/
 */
export class ContentAreaComponent {
    SCROLL_INCREMENT = 50;
    SCROLL_INTERVAL = 16;

    // Define a custom event for when the content area is scrolled.
    // The event will provide a number relating to the vertical scroll position of the content area.
    @Output() eventScrolled = new EventEmitter<number>();

    // Listen to the scroll event on this component.
    @HostListener('scroll', ['$event'])
    onListenerTriggered(event: UIEvent): void {
        // Emit our own eventScrolled event, which can be subscribed to by child components.
        this.eventScrolled.emit(event.srcElement.scrollTop);
    }

    constructor(private elRef: ElementRef) { }

    /**
     * A method that scrolls this component's element to the top.
     */
    scrollToTop() {
        const scrollToTop = window.setInterval(() => {
            const pos = this.elRef.nativeElement.scrollTop;
            if (pos > 0) {
                this.elRef.nativeElement.scrollTo(0, pos - this.SCROLL_INCREMENT); // how far to scroll on each step
            } else {
                window.clearInterval(scrollToTop);
            }
        }, this.SCROLL_INTERVAL);
    }
}
