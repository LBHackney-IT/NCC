import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from '../../environments/environment';

export const AppRoutes: Routes = [];

@NgModule({
    exports: [
        RouterModule
    ],
    imports: [
        RouterModule.forRoot(AppRoutes)
    ]
})
export class AppRoutingModule { }
