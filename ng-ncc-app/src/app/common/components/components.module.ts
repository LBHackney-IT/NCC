import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgentComponent } from './agent/agent.component';
import { CurrentCallerComponent } from './current-caller/current-caller.component';
import { EnvNameComponent } from './env-name/env-name.component';
import { PanelComponent } from './panel/panel.component';
import { PanelHeadingComponent } from './panel/heading/heading.component';
import { BoxPanelComponent } from './panel/box-panel/box-panel.component';
import { ErrorPanelComponent } from './panel/error-panel/error-panel.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        AgentComponent,
        BoxPanelComponent,
        CurrentCallerComponent,
        EnvNameComponent,
        ErrorPanelComponent,
        PanelComponent,
        PanelHeadingComponent,
    ],
    exports: [
        AgentComponent,
        BoxPanelComponent,
        CurrentCallerComponent,
        EnvNameComponent,
        ErrorPanelComponent,
        PanelComponent,
        PanelHeadingComponent,
    ]
})
export class ComponentsModule { }
