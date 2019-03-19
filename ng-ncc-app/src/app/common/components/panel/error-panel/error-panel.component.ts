import { Component } from '@angular/core';
import { PanelComponent } from '../panel.component';

@Component({
    selector: 'app-error-panel',
    templateUrl: './error-panel.component.html',
    styleUrls: ['./error-panel.component.scss']
})
export class ErrorPanelComponent extends PanelComponent { }
