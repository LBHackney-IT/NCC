import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrComponent } from './or.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [OrComponent],
    exports: [OrComponent]
})
export class OrModule { }
