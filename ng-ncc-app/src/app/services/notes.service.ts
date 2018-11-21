import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class NotesService {
    // This service controls the visibility of the add note form.
    // TODO this service should probably also be used to create notes.

    _visible: boolean;

    constructor() { }

    enable() {
        this._visible = true;
    }

    disable() {
        this._visible = false;
    }

    isEnabled(): boolean {
        return this._visible;
    }

}
