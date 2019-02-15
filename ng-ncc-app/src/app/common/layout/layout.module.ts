import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContentAreaComponent } from './content-area/content-area.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { RouteLoadingComponent } from './route-loading/route-loading.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        ContentAreaComponent,
        HeaderComponent,
        FooterComponent,
        RouteLoadingComponent
    ],
    exports: [
        ContentAreaComponent,
        HeaderComponent,
        FooterComponent,
        RouteLoadingComponent
    ]
})
export class LayoutModule { }
