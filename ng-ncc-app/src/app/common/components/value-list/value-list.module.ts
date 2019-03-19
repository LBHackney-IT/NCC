import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValueListComponent } from './value-list.component';
import { ValueListLabelComponent } from './value-list-label/value-list-label.component';
import { ValueListValueComponent } from './value-list-value/value-list-value.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [ValueListComponent, ValueListLabelComponent, ValueListValueComponent],
    exports: [ValueListComponent, ValueListLabelComponent, ValueListValueComponent]
})
export class ValueListModule { }
