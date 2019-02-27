import { Component, Input } from '@angular/core';

import { CallNatureComponent } from '../call-nature/call-nature.component';

@Component({
    selector: 'app-call-nature-dropdown',
    templateUrl: './call-nature-dropdown.component.html',
    styleUrls: ['./call-nature-dropdown.component.scss']
})
export class CallNatureDropdownComponent extends CallNatureComponent {

    @Input() disabled: boolean;

    /**
     *
     */
    canSelectCallReason(): boolean {
        return !this.disabled && this.isCallTypeSelected() && undefined !== this.callReasons;
    }

}
