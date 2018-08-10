import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageLogCallComponent } from './pages/log-call/log-call.component';
import { PageHomeComponent } from './pages/home/home.component';
import { PageIdentifyComponent } from './pages/identify/identify.component';
import { PageCommsComponent } from './pages/comms/comms.component';

const routes: Routes = [
    {
        // Home page.
        path: 'home',
        component: PageHomeComponent
    },
    {
        // Log Call page.
        path: 'log-call',
        component: PageLogCallComponent
    },
    {
        // Identify page.
        path: 'identify',
        component: PageIdentifyComponent
    },
    {
        // Comms page.
        path: 'comms',
        component: PageCommsComponent
    },
    {
        // Empty path (which should go to the home page).
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        // Catch-all (which should go to the home page).
        path: '**',
        redirectTo: '/home'
    }
];

@NgModule({
    exports: [
        RouterModule
    ],
    imports: [
        RouterModule.forRoot(routes)
    ]
})
export class AppRoutingModule { }
