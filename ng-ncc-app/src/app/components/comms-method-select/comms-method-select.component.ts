import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { CONTACT } from '../../constants/contact.constant';
import { CommsSelection } from '../../classes/comms-selection.class';
import { CommsMethodDetails } from '../../interfaces/comms-method-details.interface';
import { CallService } from '../../services/call.service';
import { Caller } from '../../interfaces/caller.interface';

@Component({
    selector: 'app-comms-method-select',
    templateUrl: './comms-method-select.component.html',
    styleUrls: ['./comms-method-select.component.css']
})
export class CommsMethodSelectComponent implements OnInit, OnChanges {
    // Whether to enable or disable communications methods.
    // (Question marks indicate that the properties are optional.)
    @Input() disableEmail?: boolean;
    @Input() disablePost?: boolean;
    @Input() disableSMS?: boolean;

    // Pass the selected comms method and details through an [Observable] event.
    @Output() selected = new EventEmitter<CommsSelection>();
    @Output() invalidated = new EventEmitter<void>();

    // A reference to the Caller we want to contact.
    caller: Caller;

    methods: object;
    selection: CommsSelection;

    constructor(private Call: CallService) { }

    ngOnInit() {
        this.caller = this.Call.getCaller();
        this.methods = CONTACT;
        this.selection = new CommsSelection;
    }

    /**
     * Respond to changes with the component's properties, INCLUDING on initialisation.
     */
    ngOnChanges() {
        // If the currently selected method has been disabled, deselect it.
        if (this.selection) {
            let condition: boolean;
            switch (this.selection.method) {
                case CONTACT.METHOD_EMAIL:
                    condition = this.disableEmail;
                    break;
                case CONTACT.METHOD_POST:
                    condition = this.disablePost;
                    break;
                case CONTACT.METHOD_SMS:
                    condition = this.disableSMS;
                    break;
            }
            if (condition) {
                this.selection.method = null;
                this.invalidated.emit();
            }
        }
    }

    /**
     * Called if we're beginning to add a new detail for the selected method.
     */
    prepareNewDetail(key: string) {
        this.selection.existing[key] = null;
        this.checkDetails();
    }

    /**
     * Returns a list of the caller's email addresses.
     */
    existingEmailAddresses(): string[] {
        return this.caller ? this.caller.getEmailAddresses() : [];
    }

    /**
     * Returns a list of the caller's telephone numbers.
     */
    existingTelephoneNumbers(): string[] {
        return this.caller ? this.caller.getTelephoneNumbers() : [];
    }

    /**
     *
     */
    checkDetails() {
        this.selected.emit(this.selection);
    }
}
