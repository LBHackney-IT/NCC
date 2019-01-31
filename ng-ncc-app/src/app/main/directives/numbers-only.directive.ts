import { Directive, ElementRef, EventEmitter, HostListener, OnInit, Output } from '@angular/core';

@Directive({
    selector: '[appNumbersOnly]'
})
export class NumbersOnlyDirective implements OnInit {

    private regex: RegExp = new RegExp('[^0-9 ]', 'gm');
    // allow numbers and spaces only.

    private element: HTMLInputElement;

    @Output() ngModelChange = new EventEmitter();

    constructor(private el: ElementRef) {
        this.element = this.el.nativeElement;
    }

    ngOnInit() {
        this.element.value = this.element.value.replace(this.regex, '');
    }

    @HostListener('keydown', ['$event.target.value'])
    onKeyDown(value) {
        this._update(value);
    }

    @HostListener('paste', ['$event'])
    onPaste(event: ClipboardEvent) {
        this._update(event.clipboardData.getData('text/plain'));
    }

    @HostListener('blur', ['$event.target.value'])
    onBlur(value) {
        this._update(value);
    }

    private _update(next: string) {
        setTimeout(() => {
            next = this.element.value.replace(this.regex, '').trim();
            this.ngModelChange.emit(next);
        }, 1);
    }

}
