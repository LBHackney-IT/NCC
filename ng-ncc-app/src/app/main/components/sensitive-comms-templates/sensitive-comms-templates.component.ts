import { Component, OnInit } from '@angular/core';

import { CommsTemplatesComponent } from '../comms-templates/comms-templates.component';
import { CommsOption } from '../../../common/classes/comms-option.class';

@Component({
    selector: 'app-sensitive-comms-templates',
    templateUrl: './sensitive-comms-templates.component.html',
    styleUrls: ['./sensitive-comms-templates.component.scss']
})
export class SensitiveCommsTemplatesComponent extends CommsTemplatesComponent {

    /**
     * Performs filtering on a list of communications options.
     */
    _filterTemplates(options: CommsOption[]): CommsOption[] {
        // We're only interested in sensitive templates.
        options = options.filter((option: CommsOption) => option.isSensitive());
        
        return options;
    }

}
