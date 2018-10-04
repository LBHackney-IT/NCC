import { Component } from '@angular/core';
import { CommsOption } from '../../../classes/comms-option.class';
import { CommunicationsPageComponent } from '../../../components/communications-page/communications-page.component';

@Component({
    selector: 'app-communications',
    templateUrl: './communications.component.html',
    styleUrls: ['./communications.component.css']
})
export class PageRentCommunicationsComponent extends CommunicationsPageComponent {

    selectedOption(option: CommsOption) {
        super.selectedOption(option);

        // This page will provide access to GOV.UK Notify templates that will require DPA answers from the caller.
        if (option.isSensitive()) {
            this.modal.dpa = true; // display the dialogue for prompting for DPA answers.
        } else {
            this.updatePreview();
        }
    }

}
