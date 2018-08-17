import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { CONTACT } from '../../constants/contact.constant';
import { CommsSelection } from '../../classes/comms-selection.class';
import { CommsMethodDetails } from '../../interfaces/comms-method-details.interface';

@Component({
    selector: 'app-comms-method-select',
    templateUrl: './comms-method-select.component.html',
    styleUrls: ['./comms-method-select.component.css']
})
export class CommsMethodSelectComponent implements OnInit, OnChanges {
    // TODO use Angular instead of GOV.UK Frontend to manage the conditional radio button content.

    // Whether to enable or disable communications methods.
    @Input() disableEmail: boolean;
    @Input() disablePost: boolean;
    @Input() disableSMS: boolean;
    // TODO include a caller property.

    // Pass the selected comms method and details through an [Observable] event.
    @Output() selected = new EventEmitter<object>();
    @Output() invalidated = new EventEmitter<void>();

    methods: object;
    selection: CommsSelection;

    constructor() { }

    ngOnInit() {
        this.methods = CONTACT;
        this.selection = new CommsSelection;
    }

    /**
     * Respond to changes with the component's properties, INCLUDING on initialisation.
     */
    ngOnChanges() {
        // If the currently selected method is disabled, reset it.
        // (Not the most elegant method, but had to put this in due to time constraints
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
        this.invalidated.emit();
    }

    /**
     *
     */
    prepareNewDetail(key: string) {
        this.selection.existing[key] = null;
        this.checkDetails();
    }

    /**
     *
     */
    checkDetails() {
        // Only emit an event if we have completed details (i.e. a selected comms method and the relevant address/number).
        if (this.selection.isComplete()) {
            this.selected.emit({
                method: this.selection.method,
                details: this.selection.getDetail()
            });
            return;
        }
    }
}
