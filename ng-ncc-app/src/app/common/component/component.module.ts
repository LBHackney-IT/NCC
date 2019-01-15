import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PanelComponent } from './panel/panel.component';
import { PanelHeadingComponent } from './panel/heading/heading.component';
import { BoxPanelComponent } from './panel/box-panel/box-panel.component';
import { ErrorPanelComponent } from './panel/error-panel/error-panel.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        PanelComponent,
        PanelHeadingComponent,
        BoxPanelComponent,
        ErrorPanelComponent
    ],
    exports: [
        PanelComponent,
        PanelHeadingComponent,
        BoxPanelComponent,
        ErrorPanelComponent
    ]
})
export class ComponentModule { }
