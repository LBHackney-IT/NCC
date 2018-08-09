import { Component, Injector, OnInit } from '@angular/core';
import { ContentAreaComponent } from '../content-area/content-area.component';

@Component({
    selector: 'app-note-form',
    templateUrl: './note-form.component.html',
    styleUrls: ['./note-form.component.scss']
})
export class NoteFormComponent implements OnInit {

    TOP_MARGIN: number = 20;    // gap between the top of the content area and the toggle button.
    containerStyle: Object;     // used to control the inline style of .note-form__container.
    comment: string;
    visible: boolean;

    constructor(private inj: Injector) {
        // We can listen for the <app-content-area/> eventScrolled event by using an Injector.
        // https://stackoverflow.com/a/40026333/4073160
        let parentComponent = this.inj.get(ContentAreaComponent);
        if (parentComponent) {
            // Subscribe to the ContentAreaComponent's eventScrolled [Observable] event.
            parentComponent.eventScrolled.subscribe(value => this._reposition(value));
        }
    }

    ngOnInit() {
        this.visible = false;
        this._resetComment();
    }

    /**
     * Show or hide the note form.
     */
    toggle() {
        this.visible = !this.visible;
    }

    /**
     * Reposition the button and form at the specified scroll position.
     * Using only CSS, the component would appear over the vertical scrollbar (if there is one) if its position is fixed.
     * We have to listen to the scroll event on the main content container, so we can position the component accordingly.
     */
    _reposition(scroll_position: number) {
        this.containerStyle = {
            'top.px': scroll_position + this.TOP_MARGIN
            // a nice shortcut for setting a pixel value.
        };
    }

    /**
     * This is called when the form is submitted.
     */
    saveComment() {
        console.log('Added a comment.');
        this._resetComment();
    }

    /**
     * Simply reset the comment body.
     */
    _resetComment() {
        this.comment = null;
    }

}
