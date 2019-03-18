import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { PageViewNotesComponent } from './view-notes/view-notes.component';
import { PageTryAgainComponent } from './try-again/try-again.component';
import { PageTransactionSuccessComponent } from './transaction/success/success.component';
import { PageTransactionErrorComponent } from './transaction/error/error.component';
import { PageLogAdditionalComponent } from './log-additional/log-additional.component';
import { PageRentComponent } from './rent/rent.component';
import { PageRentPaymentComponent } from './rent/payment/payment.component';
import { PageRentTransactionsComponent } from './rent/transactions/transactions.component';
import { PageRentStatementComponent } from './rent/statement/statement.component';
import { PagePlaygroundComponent } from './playground/playground.component';
import { PageRentCommunicationsComponent } from './rent/communications/communications.component';
import { PageTransactionComponent } from './transaction/transaction.component';
import { PageTransactionFailedComponent } from './transaction/failed/failed.component';
import { PageLogCallComponent } from './log-call/log-call.component';
import { PageLastCallsComponent } from './last-calls/last-calls.component';
import { PageIdentifyTenantsComponent } from './identify/tenants/tenants.component';
import { PageIdentifyComponent } from './identify/identify.component';
import { PageContactDetailsComponent } from './contact-details/contact-details.component';
import { PageIdentifyAddressesComponent } from './identify/addresses/addresses.component';
import { PageCallbackComponent } from './callback/callback.component';
import { PageCommsComponent } from './comms/comms.component';
import { PageAddNotesComponent } from './add-notes/add-notes.component';
import { PageAuthComponent } from './auth/auth.component';
import { MainComponentsModule } from '../components/main-components.module';
import { CommonComponentsModule } from '../../common/components/components.module';

@NgModule({
    imports: [
        CommonModule,
        MainComponentsModule,
        CommonComponentsModule,
        FormsModule,
        RouterModule
    ],
    declarations: [
        PageAddNotesComponent,
        PageAuthComponent,
        PageCallbackComponent,
        PageCommsComponent,
        PageContactDetailsComponent,
        PageIdentifyAddressesComponent,
        PageIdentifyComponent,
        PageIdentifyTenantsComponent,
        PageLastCallsComponent,
        PageLogAdditionalComponent,
        PageLogCallComponent,
        PagePlaygroundComponent,
        PageRentCommunicationsComponent,
        PageRentComponent,
        PageRentPaymentComponent,
        PageRentStatementComponent,
        PageRentTransactionsComponent,
        PageTransactionComponent,
        PageTransactionErrorComponent,
        PageTransactionFailedComponent,
        PageTransactionSuccessComponent,
        PageTryAgainComponent,
        PageViewNotesComponent,
    ]
})
export class MainPagesModule { }
