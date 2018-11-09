import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from '../environments/environment';

import { PAGES } from './constants/pages.constant';
import { AuthGuard } from './auth/auth.guard';

import { PageAuthComponent } from './pages/auth/auth.component';
import { PageCommsComponent } from './pages/comms/comms.component';
import { PageContactDetailsComponent } from './pages/contact-details/contact-details.component';
import { PageHomeComponent } from './pages/home/home.component';
import { PageIdentifyComponent } from './pages/identify/identify.component';
import { PageLastCallsComponent } from './pages/last-calls/last-calls.component';
import { PageLogAdditionalComponent } from './pages/log-additional/log-additional.component';
import { PageLogCallComponent } from './pages/log-call/log-call.component';
import { PagePaymentComponent } from './pages/payment/payment.component';
import { PagePaymentMakeComponent } from './pages/payment/make/payment-make.component';
import { PagePaymentSummaryComponent } from './pages/payment/summary/payment-summary.component';
import { PagePlaygroundComponent } from './pages/playground/playground.component';
import { PageRentCommunicationsComponent } from './pages/payment/communications/communications.component';
import { PageTransactionComponent } from './pages/transaction/transaction.component';
import { PageTransactionErrorComponent } from './pages/transaction/error/error.component';
import { PageTransactionFailedComponent } from './pages/transaction/failed/failed.component';
import { PageTransactionSuccessComponent } from './pages/transaction/success/success.component';
import { PageTransactionHistoryComponent } from './pages/payment/transactions/transaction-history.component';
import { PageTryAgainComponent } from './pages/try-again/try-again.component';
import { PageViewNotesComponent } from './pages/view-notes/view-notes.component';

import { IdentifiedCallerResolver } from './resolvers/identified-caller-resolver.service';
import { CallerCanPayResolver } from './resolvers/caller-can-pay-resolver.service';
import { CallerResolver } from './resolvers/caller-resolver.service';
import { CallNatureResolver } from './resolvers/call-nature-resolver.service';
import { ContactDetailsResolver } from './resolvers/contact-details-resolver.service';
import { AccountDetailsResolver } from './resolvers/account-details-resolver.service';

export const AppRoutes: Routes = [
    // -------------------------------------------------------------------------------------------------------------------------------------
    // PAGES NOT REQUIRING AUTHENTICATION
    // -------------------------------------------------------------------------------------------------------------------------------------
    {
        // A page for unidentified users, or those with no access.
        path: PAGES.TRY_AGAIN.route,
        component: PageTryAgainComponent
    },
    {
        // A page for testing and diagnosing components.
        path: PAGES.PLAYGROUND.route,
        component: PagePlaygroundComponent
    },

    {
        // An authentication route for single sign on (SSO), which takes a userdata code to identify the logged in user.
        // This route doesn't have its own page, but the AuthGuard is used to authenticate the user.
        // Normally we would add child pages to this route, but we want to keep the existing route paths.
        path: `${PAGES.AUTHENTICATION.route}/:code`,
        pathMatch: 'full',
        canActivate: [AuthGuard],
        children: []
    },

    // -------------------------------------------------------------------------------------------------------------------------------------
    // PAGES REQUIRING AUTHENTICATION
    // -------------------------------------------------------------------------------------------------------------------------------------
    {
        // Previous x Calls page.
        path: PAGES.PREVIOUS_CALLS.route,
        component: PageLastCallsComponent,
        canActivate: [AuthGuard]
    },
    {
        // Log Call page.
        path: PAGES.LOG_CALL.route,
        component: PageLogCallComponent,
        canActivate: [AuthGuard]
    },
    {
        // Handling information returned from Paris.
        path: `${PAGES.TRANSACTION.route}`,
        canActivate: [AuthGuard],
        children: [
            {
                // Successful transaction page.
                path: PAGES.TRANSACTION_SUCCESS.route,
                component: PageTransactionSuccessComponent
            },
            {
                // Error page.
                path: PAGES.TRANSACTION_ERROR.route,
                component: PageTransactionErrorComponent
            },
            {
                // Failed transaction page.
                path: PAGES.TRANSACTION_FAILED.route,
                component: PageTransactionFailedComponent
            },
            {
                // Failed transaction page.
                path: ':data',
                component: PageTransactionComponent
            },
        ]
    },
    {
        // Rent page.
        path: PAGES.RENT.route,
        component: PagePaymentComponent,
        canActivate: [AuthGuard],
        children: [
            {
                // Rent > Summary.
                path: PAGES.RENT_SUMMARY.route,
                component: PagePaymentSummaryComponent,
                resolve: {
                    caller: IdentifiedCallerResolver
                }
            },
            {
                // Rent > Transactions.
                path: PAGES.RENT_TRANSACTIONS.route,
                component: PageTransactionHistoryComponent,
                resolve: {
                    caller: IdentifiedCallerResolver
                }
            },
            {
                // Rent > Make (Payment).
                path: PAGES.RENT_PAYMENT.route,
                component: PagePaymentMakeComponent,
                resolve: {
                    caller: CallerCanPayResolver
                }
            },
            {
                // Rent > Communications.
                path: PAGES.RENT_COMMS.route,
                component: PageRentCommunicationsComponent,
                resolve: {
                    caller: IdentifiedCallerResolver
                }
            },
            {
                // Catch-all (which should go to the summary child page).
                path: '',
                pathMatch: 'full',
                redirectTo: PAGES.RENT_SUMMARY.route
            }
        ]
    },
    {
        // Identify page.
        path: PAGES.IDENTIFY.route,
        component: PageIdentifyComponent,
        canActivate: [AuthGuard],
        resolve: {
            call_nature: CallNatureResolver
        }
    },
    {
        // [Edit] Contact Details page.
        path: PAGES.EDIT_CONTACT_DETAILS.route,
        component: PageContactDetailsComponent,
        canActivate: [AuthGuard],
        resolve: {
            caller: IdentifiedCallerResolver,
            details: ContactDetailsResolver
        }
    },
    {
        // Comms page.
        path: PAGES.COMMS.route,
        component: PageCommsComponent,
        canActivate: [AuthGuard],
        resolve: {
            caller: CallerResolver,
            call_nature: CallNatureResolver
        }
    },
    {
        // View Notes page.
        path: PAGES.VIEW_NOTES.route,
        component: PageViewNotesComponent,
        canActivate: [AuthGuard],
        resolve: {
            caller: CallerResolver
            // caller: IdentifiedCallerResolver
        }
    },
    {
        // Log Additional Request page.
        path: PAGES.ADDITIONAL_REASON.route,
        canActivate: [AuthGuard],
        component: PageLogAdditionalComponent,
        resolve: {
            caller: CallerResolver
        }
    },

    // -------------------------------------------------------------------------------------------------------------------------------------
    // CATCH-ALL ROUTES
    // -------------------------------------------------------------------------------------------------------------------------------------
    {
        // Empty path (which should go to the home page).
        // If the "Previous x Calls" page has been disabled, the we go to the "Start New Call" page.
        path: '',
        redirectTo: environment.disable.previousCalls ? PAGES.LOG_CALL.route : PAGES.PREVIOUS_CALLS.route,
        pathMatch: 'full'
    },
    {
        // Catch-all (which should go to the home page).
        // If the "Previous x Calls" page has been disabled, the we go to the "Start New Call" page.
        path: '**',
        redirectTo: environment.disable.previousCalls ? PAGES.LOG_CALL.route : PAGES.PREVIOUS_CALLS.route
    }
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
