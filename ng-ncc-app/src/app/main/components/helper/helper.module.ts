import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelperComponent } from 'src/app/main/components/helper/helper.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [HelperComponent],
    exports: [HelperComponent]
})
export class HelperModule { }
