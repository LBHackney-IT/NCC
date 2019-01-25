import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from '../../environments/environment';

import { PageRespondComponent } from './pages/respond/respond.component';

export const AppRoutes: Routes = [
    {
        // Accessing this app with a callback ID and email address.
        path: ':callbackID/:email',
        component: PageRespondComponent
    },
    {
        // TODO Accessing this app with no parameters.
        path: '',
        component: PageRespondComponent
    },
];

@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forRoot(AppRoutes)]
})
export class AppRoutingModule { }
