import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumbersOnlyDirective } from './numbers-only.directive';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [NumbersOnlyDirective],
    exports: [NumbersOnlyDirective]
})
export class NumbersOnlyModule { }
