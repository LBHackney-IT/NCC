import { Routes } from '@angular/router';

import { PageLogCallComponent } from './pages/log-call/log-call.component';
import { PageHomeComponent } from './pages/home/home.component';
import { PageIdentifyComponent } from './pages/identify/identify.component';
import { PageCommsComponent } from './pages/comms/comms.component';

import { NotifyTemplatesResolver } from './resolvers/notify-templates-resolver.service';

export const AppRoutes: Routes = [
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
        component: PageCommsComponent,
        resolve: {
            templates: NotifyTemplatesResolver
        }
    },
    {
        // Catch-all (which should go to the home page).
        path: '**',
        redirectTo: '/home'
    }
];
