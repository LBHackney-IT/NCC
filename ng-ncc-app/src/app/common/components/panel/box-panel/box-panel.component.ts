import { Component } from '@angular/core';
import { PanelComponent } from '../panel.component';

@Component({
    selector: 'app-box-panel',
    templateUrl: './box-panel.component.html',
    styleUrls: ['./box-panel.component.scss']
})
export class BoxPanelComponent extends PanelComponent { }
