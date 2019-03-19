import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CallNatureDialogueComponent } from './call-nature-dialogue/call-nature-dialogue.component';
import { CallNatureDropdownComponent } from './call-nature-dropdown/call-nature-dropdown.component';
import { CallNatureComponent } from './call-nature.component';
import { PanelModule } from 'src/app/common/components/panel/panel.module';
import { HelperModule } from 'src/app/main/components/helper/helper.module';
import { ChecklistModule } from 'angular-checklist';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ChecklistModule,
        HelperModule,
        PanelModule
    ],
    declarations: [CallNatureComponent, CallNatureDialogueComponent, CallNatureDropdownComponent],
    exports: [CallNatureComponent, CallNatureDialogueComponent, CallNatureDropdownComponent]
})
export class CallNatureModule { }
