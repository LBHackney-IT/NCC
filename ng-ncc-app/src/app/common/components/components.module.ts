import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgentComponent } from './agent/agent.component';
import { CurrentCallerComponent } from './current-caller/current-caller.component';
import { EnvNameComponent } from './env-name/env-name.component';
import { PanelComponent } from './panel/panel.component';
import { PanelHeadingComponent } from './panel/heading/heading.component';
import { BoxPanelComponent } from './panel/box-panel/box-panel.component';
import { ErrorPanelComponent } from './panel/error-panel/error-panel.component';
import { SuccessPanelComponent } from './panel/success-panel/success-panel.component';
import { CallerAddressComponent } from './caller-address/caller-address.component';
import { UserLookupComponent } from './user-lookup/user-lookup.component';
import { FormsModule } from '../../../../node_modules/@angular/forms';
import { WarningComponent } from './warning/warning.component';
import { ValueListComponent } from './value-list/value-list.component';
import { ValueListLabelComponent } from './value-list/value-list-label/value-list-label.component';
import { ValueListValueComponent } from './value-list/value-list-value/value-list-value.component';
import { TabsComponent } from './tabs/tabs.component';
import { TabComponent } from './tabs/tab/tab.component';
import { BackLinkModule } from './back-link/back-link.module';
import { OrModule } from './or/or.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        BackLinkModule,
        OrModule
    ],
    declarations: [
        AgentComponent,
        BoxPanelComponent,
        CallerAddressComponent,
        CurrentCallerComponent,
        EnvNameComponent,
        ErrorPanelComponent,
        OrComponent,
        PanelComponent,
        PanelHeadingComponent,
        SuccessPanelComponent,
        TabComponent,
        TabsComponent,
        UserLookupComponent,
        WarningComponent,
        ValueListComponent,
        ValueListLabelComponent,
        ValueListValueComponent
    ],
    exports: [
        AgentComponent,
        BoxPanelComponent,
        CallerAddressComponent,
        CurrentCallerComponent,
        EnvNameComponent,
        ErrorPanelComponent,
        OrComponent,
        PanelComponent,
        PanelHeadingComponent,
        SuccessPanelComponent,
        TabComponent,
        TabsComponent,
        UserLookupComponent,
        WarningComponent,
        ValueListComponent,
        ValueListLabelComponent,
        ValueListValueComponent
    ]
})
export class CommonComponentsModule { }
