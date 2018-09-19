import { Component, HostBinding, Input } from '@angular/core';

@Component({
    selector: 'app-panel',
    templateUrl: './panel.component.html',
    styleUrls: ['./panel.component.scss']
})
export class PanelComponent {
    @HostBinding('class.panel--box') @Input() boxStyle?: boolean = false;
    // see https://stackoverflow.com/a/39161705/4073160
    // This will apply the panel--box class to the host element if the boxStyle attribute is truthy.
}
