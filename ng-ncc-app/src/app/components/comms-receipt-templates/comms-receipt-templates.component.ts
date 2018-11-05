import { Component, OnInit } from '@angular/core';

import { CommsTemplatesComponent } from '../comms-templates/comms-templates.component';
import { CommsOption } from '../../classes/comms-option.class';

@Component({
    selector: 'app-comms-receipt-templates',
    templateUrl: './comms-receipt-templates.component.html',
    styleUrls: ['./comms-receipt-templates.component.scss']
})
export class CommsReceiptTemplatesComponent extends CommsTemplatesComponent {

    /**
     * Performs filtering on a list of communications options.
     */
    _filterTemplates(options: CommsOption[]): CommsOption[] {
        // We're only interested in receipt templates.
        options = options.filter((option: CommsOption) => option.isReceipt());

        return options;
    }

}
