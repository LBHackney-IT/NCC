import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DraggableModule } from 'src/app/common/directives/draggable/draggable.module';
import { NoteFormComponent } from './note-form.component';
import { ValueListModule } from 'src/app/common/components/value-list/value-list.module';
import { FormsModule } from '@angular/forms';
import { CallNatureModule } from 'src/app/main/components/call-nature/call-nature.module';
import { PanelModule } from 'src/app/common/components/panel/panel.module';

@NgModule({
    imports: [
        CommonModule,
        DraggableModule,
        FormsModule,
        CallNatureModule,
        PanelModule,
        ValueListModule
    ],
    declarations: [NoteFormComponent],
    exports: [NoteFormComponent]
})
export class NoteFormModule { }
