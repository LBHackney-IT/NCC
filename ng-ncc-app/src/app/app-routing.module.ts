import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageLogCallComponent } from './pages/log-call/log-call.component';
import { PageHomeComponent } from './pages/home/home.component';
import { PageIdentifyComponent } from './pages/identify/identify.component';
import { PageCommsComponent } from './pages/comms/comms.component';
import { PagePlaygroundComponent } from './pages/playground/playground.component';

import { CallerResolver } from './resolvers/caller-resolver.service';
import { CallNatureResolver } from './resolvers/call-nature-resolver.service';
import { NotifyTemplatesResolver } from './resolvers/notify-templates-resolver.service';

export const AppRoutes: Routes = [
    // {
    //     // Home page.
    //     path: 'home',
    //     component: PageHomeComponent
    // },
    {
        // Playground page (for testing things).
        path: 'playground',
        component: PagePlaygroundComponent
    },
    {
        // Log Call page.
        path: 'log-call',
        component: PageLogCallComponent
    },
    {
        // Identify page.
        path: 'identify',
        component: PageIdentifyComponent,
        resolve: {
            call_nature: CallNatureResolver,
            templates: NotifyTemplatesResolver
        }
    },
    {
        // Comms page.
        path: 'comms',
        component: PageCommsComponent,
        resolve: {
            caller: CallerResolver,
            call_nature: CallNatureResolver,
            templates: NotifyTemplatesResolver
        }
    },
    {
        // Empty path (which should go to the home page).
        path: '',
        redirectTo: '/log-call',
        pathMatch: 'full'
    },
    {
        // Catch-all (which should go to the home page).
        path: '**',
        redirectTo: '/log-call'
    }
    // {
    //     // Empty path (which should go to the home page).
    //     path: '',
    //     redirectTo: '/home',
    //     pathMatch: 'full'
    // },
    // {
    //     // Catch-all (which should go to the home page).
    //     path: '**',
    //     redirectTo: '/home'
    // }
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
