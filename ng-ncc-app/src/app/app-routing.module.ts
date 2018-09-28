import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageCommsComponent } from './pages/comms/comms.component';
import { PageContactDetailsComponent } from './pages/contact-details/contact-details.component';
import { PageHomeComponent } from './pages/home/home.component';
import { PageIdentifyComponent } from './pages/identify/identify.component';
import { PageLogAdditionalComponent } from './pages/log-additional/log-additional.component';
import { PageLogCallComponent } from './pages/log-call/log-call.component';
import { PagePaymentComponent } from './pages/payment/payment.component';
import { PagePaymentMakeComponent } from './pages/payment/make/payment-make.component';
import { PagePaymentSummaryComponent } from './pages/payment/summary/payment-summary.component';
import { PagePlaygroundComponent } from './pages/playground/playground.component';
import { PageRentCommunicationsComponent } from './pages/payment/communications/communications.component';
import { PageTransactionHistoryComponent } from './pages/payment/transactions/transaction-history.component';
import { PageViewNotesComponent } from './pages/view-notes/view-notes.component';

import { IdentifiedCallerResolver } from './resolvers/identified-caller-resolver.service';
import { CallerResolver } from './resolvers/caller-resolver.service';
import { CallNatureResolver } from './resolvers/call-nature-resolver.service';
import { ContactDetailsResolver } from './resolvers/contact-details-resolver.service';
import { AccountDetailsResolver } from './resolvers/account-details-resolver.service';

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
        // Payment page.
        path: 'payment',
        component: PagePaymentComponent,
        children: [
            {
                path: 'summary',
                component: PagePaymentSummaryComponent,
                resolve: {
                    accountDetails: AccountDetailsResolver,
                    caller: IdentifiedCallerResolver
                }
            },
            {
                path: 'transactions',
                component: PageTransactionHistoryComponent,
                resolve: {
                    accountDetails: AccountDetailsResolver,
                    caller: IdentifiedCallerResolver
                }
            },
            {
                path: 'make',
                component: PagePaymentMakeComponent,
                resolve: {
                    accountDetails: AccountDetailsResolver,
                    caller: IdentifiedCallerResolver
                }
            },
            {
                path: 'communications',
                component: PageRentCommunicationsComponent,
                resolve: {
                    accountDetails: AccountDetailsResolver,
                    caller: IdentifiedCallerResolver
                }
            },
            {
                // Catch-all (which should go to the summary child page).
                path: '**',
                redirectTo: 'summary'
            }
        ]
    },
    {
        // Identify page.
        path: 'caller-details',
        component: PageIdentifyComponent,
        resolve: {
            call_nature: CallNatureResolver
        }
    },
    {
        // [Edit] Contact Details page.
        path: 'contact-details',
        component: PageContactDetailsComponent,
        resolve: {
            caller: IdentifiedCallerResolver,
            details: ContactDetailsResolver
        }
    },
    {
        // Comms page.
        path: 'comms',
        component: PageCommsComponent,
        resolve: {
            caller: CallerResolver,
            call_nature: CallNatureResolver
        }
    },
    {
        // View Notes page.
        path: 'notes',
        component: PageViewNotesComponent,
        resolve: {
            caller: IdentifiedCallerResolver
        }
    },
    {
        // View Notes page.
        path: 'log-additional',
        component: PageLogAdditionalComponent,
        resolve: {
            caller: CallerResolver
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
