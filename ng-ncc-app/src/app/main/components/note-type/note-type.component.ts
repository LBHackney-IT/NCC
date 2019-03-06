import { Component, Input } from '@angular/core';

import { NOTES } from '../../../common/constants/notes.constant';

@Component({
    selector: 'app-note-type',
    templateUrl: './note-type.component.html',
    styleUrls: ['./note-type.component.scss']
})
export class NoteTypeComponent {
    @Input() type: string;

    getNoteTypeBadgeClass(): string {
        const classes = {
            'note-type--automatic': NOTES.TYPE_AUTOMATIC === this.type,
            'note-type--manual': NOTES.TYPE_MANUAL === this.type,
            'note-type--diary': NOTES.TYPE_ACTION_DIARY === this.type,
            'note-type--callback': NOTES.TYPE_CALLBACK === this.type,
            'note-type--uh': NOTES.TYPE_UH === this.type
        };
        return Object.keys(this.pickBy(classes)).join(' ');
    }

    /**
     *
     */
    private pickBy(object) {
        // https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_pickby
        const obj = {};
        for (const key in object) {
            if (object[key] !== null && object[key] !== false && object[key] !== undefined) {
                obj[key] = object[key];
            }
        }
        return obj;
    }

    /**
     *
     */
    get typeText(): string {
        switch (this.type) {
            case NOTES.TYPE_UH:
                return 'Universal Housing Note';
            default:
                return this.type;
        }
    }

}
