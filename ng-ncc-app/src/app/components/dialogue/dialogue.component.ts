import { Component, EventEmitter, HostListener, Input, Output, ElementRef, ViewChild, OnChanges, SimpleChange } from '@angular/core';

@Component({
    selector: 'app-dialogue',
    templateUrl: './dialogue.component.html',
    styleUrls: ['./dialogue.component.scss']
})
export class DialogueComponent implements OnChanges {
    @Input() show: boolean;
    @Input() buttonText: string;
    @Input() large?: boolean;
    @Output() showChange = new EventEmitter<boolean>();
    @Output() closed = new EventEmitter<void>();

    defaultButtonText = 'Okay';

    // https://stackoverflow.com/a/46720813/4073160
    @ViewChild('dialogueButton') dialogueButton: ElementRef;

    // Listen for the Esc key to close the dialogue.
    // It will only work if the dialogue within is in focus.
    @HostListener('keyup.esc', ['$event'])
    onListenerTriggered(event: UIEvent): void {
        this.closeDialogue();
    }

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        if (changes.show && true === changes.show.currentValue) {
            // Set the focus on the button.
            setTimeout(() => { this.dialogueButton.nativeElement.focus(); }, 1);
        }
    }

    closeDialogue() {
        this.show = false;
        this.closed.emit();
        this.showChange.emit(this.show);
    }

}
