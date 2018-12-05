import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: '[appNumbersOnly]'
})
export class NumbersOnlyDirective {

    private regex: RegExp = new RegExp('[^0-9 ]', 'gm');
    // allow numbers and spaces only.

    constructor(private el: ElementRef) { }

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        let next: string = this.el.nativeElement.value.concat(event.key);

        if (next) {
            next = next.replace(this.regex, '');
        }

        setTimeout(() => {
            const current: string = this.el.nativeElement.value;
            if (next !== current && current.match(this.regex)) {
                this.el.nativeElement.value = String(next);
            }
        }, 1);
    }

}
