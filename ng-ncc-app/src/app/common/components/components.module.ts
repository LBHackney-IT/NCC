import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgentComponent } from './agent/agent.component';
import { CurrentCallerComponent } from './current-caller/current-caller.component';
import { EnvNameComponent } from './env-name/env-name.component';
import { CallerAddressComponent } from './caller-address/caller-address.component';
import { UserLookupComponent } from './user-lookup/user-lookup.component';
import { FormsModule } from '@angular/forms';
import { WarningComponent } from './warning/warning.component';
import { TabsComponent } from './tabs/tabs.component';
import { TabComponent } from './tabs/tab/tab.component';
import { BackLinkModule } from './back-link/back-link.module';
import { OrModule } from './or/or.module';
import { PanelModule } from './panel/panel.module';
import { ValueListModule } from './value-list/value-list.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        BackLinkModule,
        OrModule,
        PanelModule,
        ValueListModule
    ],
    declarations: [
        AgentComponent,
        CallerAddressComponent,
        CurrentCallerComponent,
        EnvNameComponent,
        TabComponent,
        TabsComponent,
        UserLookupComponent,
        WarningComponent,
    ],
    exports: [
        AgentComponent,
        CallerAddressComponent,
        CurrentCallerComponent,
        EnvNameComponent,
        TabComponent,
        TabsComponent,
        UserLookupComponent,
        WarningComponent,
    ]
})
export class CommonComponentsModule { }
