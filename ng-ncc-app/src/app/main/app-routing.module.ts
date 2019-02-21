import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from '../../environments/environment';

import { PAGES } from '../common/constants/pages.constant';

import { PageAuthComponent } from './pages/auth/auth.component';
import { PageAddNotesComponent } from './pages/add-notes/add-notes.component';
import { PageCallbackComponent } from './pages/callback/callback.component';
import { PageCommsComponent } from './pages/comms/comms.component';
import { PageContactDetailsComponent } from './pages/contact-details/contact-details.component';
import { PageIdentifyAddressesComponent } from './pages/identify/addresses/addresses.component';
import { PageIdentifyComponent } from './pages/identify/identify.component';
import { PageIdentifyTenantsComponent } from './pages/identify/tenants/tenants.component';
import { PageLastCallsComponent } from './pages/last-calls/last-calls.component';
import { PageLogAdditionalComponent } from './pages/log-additional/log-additional.component';
import { PageLogCallComponent } from './pages/log-call/log-call.component';
import { PagePlaygroundComponent } from './pages/playground/playground.component';
import { PageRentCommunicationsComponent } from './pages/rent/communications/communications.component';
import { PageRentComponent } from './pages/rent/rent.component';
import { PageRentPaymentComponent } from './pages/rent/payment/payment.component';
import { PageRentStatementComponent } from './pages/rent/statement/statement.component';
import { PageRentTransactionsComponent } from './pages/rent/transactions/transactions.component';
import { PageTransactionComponent } from './pages/transaction/transaction.component';
import { PageTransactionErrorComponent } from './pages/transaction/error/error.component';
import { PageTransactionFailedComponent } from './pages/transaction/failed/failed.component';
import { PageTransactionSuccessComponent } from './pages/transaction/success/success.component';
import { PageTryAgainComponent } from './pages/try-again/try-again.component';
import { PageViewNotesComponent } from './pages/view-notes/view-notes.component';

import { AuthGuard } from './guard/auth.guard';
import { IsIdentifiedCallerGuard } from './guard/is-identified-caller.guard';
import { IsIdentifiedOrNonTenantCallerGuard } from './guard/is-identified-or-non-tenant-caller.guard';
import { CallerCanMakePaymentGuard } from './guard/caller-can-make-payment.guard';
import { IsCallerAvailableGuard } from './guard/is-caller-available.guard';

import { ContactDetailsResolver } from './resolvers/contact-details-resolver.service';
import { AccountDetailsResolver } from './resolvers/account-details-resolver.service';
import { IsLeaseholdPropertyResolver } from './resolvers/is-leasehold-property.resolver';

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

    // An authentication route for single sign on (SSO), which takes a userdata code to identify the logged in user.
    // This route doesn't have its own page, but the AuthGuard is used to authenticate the user.
    // Normally we would add child pages to this route, but we want to keep the existing route paths.
    {
        // This URL works the same as the one below, except we use it to enable "view only" mode.
        path: `${PAGES.AUTHENTICATION.route}/:code/:viewonly`,
        pathMatch: 'full',
        canActivate: [AuthGuard],
        children: []
    },
    {
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
        // Add Notes page.
        path: PAGES.ADD_NOTES.route,
        component: PageAddNotesComponent,
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
        component: PageRentComponent,
        canActivate: [AuthGuard],
        resolve: {
            isLeasehold: IsLeaseholdPropertyResolver
        },
        children: [
            {
                // Rent > Transactions.
                path: PAGES.RENT_TRANSACTIONS.route,
                component: PageRentTransactionsComponent,
                canActivate: [IsIdentifiedOrNonTenantCallerGuard]
            },
            {
                // Rent > Make (Payment).
                path: PAGES.RENT_PAYMENT.route,
                component: PageRentPaymentComponent,
                canActivate: [CallerCanMakePaymentGuard],
                resolve: {
                    isLeasehold: IsLeaseholdPropertyResolver
                }
            },
            {
                // Rent > Communications.
                path: PAGES.RENT_COMMS.route,
                component: PageRentCommunicationsComponent,
                canActivate: [IsIdentifiedOrNonTenantCallerGuard]
            },
            {
                // Catch-all (which should go to the summary child page).
                path: '',
                pathMatch: 'full',
                redirectTo: PAGES.RENT_TRANSACTIONS.route
            }
        ]
    },
    {
        // Statement page.
        path: PAGES.RENT_STATEMENT.route,
        component: PageRentStatementComponent,
        canActivate: [
            AuthGuard,
            IsIdentifiedCallerGuard
        ]
    },
    {
        // Identify page.
        path: PAGES.IDENTIFY.route,
        component: PageIdentifyComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: PAGES.IDENTIFY_ADDRESSES.route,
                component: PageIdentifyAddressesComponent
            },
            {
                path: PAGES.IDENTIFY_TENANTS.route,
                component: PageIdentifyTenantsComponent,
                resolve: {
                    isLeasehold: IsLeaseholdPropertyResolver
                }
            }
        ]
    },
    {
        // [Edit] Contact Details page.
        path: PAGES.EDIT_CONTACT_DETAILS.route,
        component: PageContactDetailsComponent,
        canActivate: [
            AuthGuard,
            IsIdentifiedCallerGuard
        ],
        resolve: {
            details: ContactDetailsResolver,
            isLeasehold: IsLeaseholdPropertyResolver
        }
    },
    {
        // Comms page.
        path: PAGES.COMMS.route,
        component: PageCommsComponent,
        canActivate: [
            AuthGuard,
            IsCallerAvailableGuard
        ],
        resolve: {
            isLeasehold: IsLeaseholdPropertyResolver
        }
    },
    {
        // View Notes page.
        path: PAGES.VIEW_NOTES.route,
        component: PageViewNotesComponent,
        canActivate: [
            AuthGuard,
            IsIdentifiedOrNonTenantCallerGuard
        ]
    },
    {
        // Request a Callback page.
        path: PAGES.REQUEST_CALLBACK.route,
        canActivate: [
            AuthGuard,
            IsIdentifiedOrNonTenantCallerGuard
        ],
        component: PageCallbackComponent
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
    ],
    providers: [
        IsLeaseholdPropertyResolver
    ]
})
export class AppRoutingModule { }
