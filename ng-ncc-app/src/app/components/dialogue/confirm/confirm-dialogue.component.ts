import { Component, EventEmitter, HostListener, Input, Output, ElementRef, ViewChild, OnChanges, SimpleChange } from '@angular/core';

// TODO we could probably extend the dialogue component to create this one.

@Component({
    selector: 'app-confirm-dialogue',
    templateUrl: './confirm-dialogue.component.html',
    styleUrls: ['./confirm-dialogue.component.scss']
})
export class ConfirmDialogueComponent implements OnChanges {
    @Input() show: boolean;
    @Input() yesButtonText: string;
    @Input() noButtonText: string;
    @Output() showChange = new EventEmitter<boolean>();
    @Output() selectedYes = new EventEmitter<void>();
    @Output() selectedNo = new EventEmitter<void>();

    defaultYesButtonText = 'Yes';
    defaultNoButtonText = 'No';

    // https://stackoverflow.com/a/46720813/4073160
    @ViewChild('dialogueButton') dialogueButton: ElementRef;

    // Listen for the Esc key to close the dialogue.
    // It will only work if the dialogue within is in focus.
    @HostListener('keyup.esc', ['$event'])
    onListenerTriggered(event: UIEvent): void {
        this.answerNo();
    }

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        if (changes.show && true === changes.show.currentValue) {
            // Set the focus on the button.
            setTimeout(() => { this.dialogueButton.nativeElement.focus(); }, 1);
        }
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
