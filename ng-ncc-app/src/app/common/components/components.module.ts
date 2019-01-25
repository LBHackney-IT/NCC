import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgentComponent } from './agent/agent.component';
import { CurrentCallerComponent } from './current-caller/current-caller.component';
import { EnvNameComponent } from './env-name/env-name.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
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
        CurrentCallerComponent,
        EnvNameComponent,
        FooterComponent,
        HeaderComponent,
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
export class ComponentsModule { }
