import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BackLinkComponent } from './back-link.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule
    ],
    declarations: [BackLinkComponent],
    exports: [BackLinkComponent]
})
export class BackLinkModule { }
