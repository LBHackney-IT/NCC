import { Component, Input, OnInit } from '@angular/core';
import { CONTACT } from '../../constants/contact.constant';

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

    constructor() { }

    ngOnInit() {
        this.methods = CONTACT;
    }

}
