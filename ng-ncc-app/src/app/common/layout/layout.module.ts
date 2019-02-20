import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutContentComponent } from './content-area/content-area.component';
import { LayoutFooterComponent } from './footer/footer.component';
import { LayoutHeaderComponent } from './header/header.component';
import { RouteLoadingComponent } from './route-loading/route-loading.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        LayoutContentComponent,
        LayoutFooterComponent,
        LayoutHeaderComponent,
        RouteLoadingComponent
    ],
    exports: [
        LayoutContentComponent,
        LayoutFooterComponent,
        LayoutHeaderComponent,
        RouteLoadingComponent
    ]
})
export class LayoutModule { }
