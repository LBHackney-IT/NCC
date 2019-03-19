import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelComponent } from './panel.component';
import { SuccessPanelComponent } from './success-panel/success-panel.component';
import { ErrorPanelComponent } from './error-panel/error-panel.component';
import { BoxPanelComponent } from './box-panel/box-panel.component';
import { PanelHeadingComponent } from './panel-heading/panel-heading.component';

@NgModule({
    imports: [CommonModule],
    declarations: [PanelComponent, PanelHeadingComponent, SuccessPanelComponent, ErrorPanelComponent, BoxPanelComponent],
    exports: [PanelComponent, PanelHeadingComponent, SuccessPanelComponent, ErrorPanelComponent, BoxPanelComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PanelModule { }
