import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from '../../environments/environment';

import { PageRespondComponent } from './pages/respond/respond.component';

export const AppRoutes: Routes = [
    {
        path: '',
        component: PageRespondComponent
    },
];

@NgModule({
    exports: [
        RouterModule
    ],
    imports: [
        RouterModule.forRoot(AppRoutes)
    ]
})
export class AppRoutingModule { }
