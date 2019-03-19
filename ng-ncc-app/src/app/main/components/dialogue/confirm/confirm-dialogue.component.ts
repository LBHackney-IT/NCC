import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { DialogueComponent } from '../dialogue.component';

@Component({
    selector: 'app-confirm-dialogue',
    templateUrl: './confirm-dialogue.component.html',
    styleUrls: ['./confirm-dialogue.component.scss']
})
export class ConfirmDialogueComponent extends DialogueComponent {

    // This component extends the original dialogue component.

    @Input() yesButtonText: string;
    @Input() noButtonText: string;
    @Output() selectedYes = new EventEmitter<void>();
    @Output() selectedNo = new EventEmitter<void>();

    defaultYesButtonText = 'Yes';
    defaultNoButtonText = 'No';

    // Listen for the Esc key to close the dialogue.
    // It will only work if the dialogue within is in focus.
    @HostListener('keyup.esc', ['$event'])
    onListenerTriggered(event: UIEvent): void {
        this.answerNo();
    }

    answerYes() {
        this.selectedYes.emit();
        this.closeDialogue();
    }

    answerNo() {
        this.selectedNo.emit();
        this.closeDialogue();
    }

    closeDialogue() {
        this.show = false;
        this.showChange.emit(this.show);
    }

}
