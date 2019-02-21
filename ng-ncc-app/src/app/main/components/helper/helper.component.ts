import { Component, HostBinding, Input } from '@angular/core';

@Component({
    selector: 'app-helper',
    templateUrl: './helper.component.html',
    styleUrls: ['./helper.component.scss']
})
export class HelperComponent {

    @HostBinding('class.helper--below')
    @Input() below: boolean;
}
