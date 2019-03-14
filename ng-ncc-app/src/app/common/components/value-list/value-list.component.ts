import { Component, HostBinding, Input, OnChanges } from '@angular/core';

@Component({
    selector: 'app-value-list',
    templateUrl: './value-list.component.html',
    styleUrls: ['./value-list.component.scss']
})
export class ValueListComponent implements OnChanges {
    @Input() emphasise?: string;
    @HostBinding('class.more-label') emphasiseLabel: boolean;
    @HostBinding('class.less-label') emphasiseValue: boolean;

    EMPHASISE_LABEL = 'label';
    EMPHASISE_VALUE = 'value';

    ngOnChanges() {
        this.emphasiseLabel = this.EMPHASISE_LABEL === this.emphasise;
        this.emphasiseValue = this.EMPHASISE_VALUE === this.emphasise;
    }

}
