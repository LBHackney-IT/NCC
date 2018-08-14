import { Component, Input, OnInit } from '@angular/core';
import { CONTACT } from '../../constants/contact.constant';
import { CommsSelection } from '../../classes/comms-selection.class';

@Component({
    selector: 'app-comms-method-select',
    templateUrl: './comms-method-select.component.html',
    styleUrls: ['./comms-method-select.component.css']
})
export class CommsMethodSelectComponent implements OnInit {

    // Whether to enable or disable communications methods.
    @Input() disableEmail: boolean;
    @Input() disablePost: boolean;
    @Input() disableSMS: boolean;
    // TODO include a caller property.

    methods: object;
    selection: CommsSelection;

    constructor() { }

    ngOnInit() {
        this.methods = CONTACT;
        this.selection = new CommsSelection;
    }

    ngOnChanges() {
        // If the currently selected method is disabled, reset it.
        // (Not the most elegant method, but had to put this in due to time constraints.)
        if (this.selection) {
            if (this.disableEmail && CONTACT.METHOD_EMAIL === this.selection.method) {
                this.selection.method = null;
            }
            if (this.disablePost && CONTACT.METHOD_POST === this.selection.method) {
                this.selection.method = null;
            }
            if (this.disableSMS && CONTACT.METHOD_SMS === this.selection.method) {
                this.selection.method = null;
            }
        }
    }

    /**
     *
     */
    prepareNewDetail(key: string) {
        this.selection.existing[key] = null;
    }
}
