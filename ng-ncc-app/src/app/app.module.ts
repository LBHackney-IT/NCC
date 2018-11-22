import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { NavigationComponent } from './components/navigation/navigation.component';

import { AccountDetailsResolver } from './resolvers/account-details-resolver.service';
import { CallerCanPayResolver } from './resolvers/caller-can-pay-resolver.service';
import { CallerResolver } from './resolvers/caller-resolver.service';
import { CallNatureResolver } from './resolvers/call-nature-resolver.service';
import { ContactDetailsResolver } from './resolvers/contact-details-resolver.service';
import { IdentifiedCallerResolver } from './resolvers/identified-caller-resolver.service';

import { PageAuthComponent } from './pages/auth/auth.component';
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
import { PageRentSummaryComponent } from './pages/rent/summary/summary.component';
import { PageRentTransactionsComponent } from './pages/rent/transactions/transactions.component';
import { PageTransactionComponent } from './pages/transaction/transaction.component';
import { PageTransactionErrorComponent } from './pages/transaction/error/error.component';
import { PageTransactionFailedComponent } from './pages/transaction/failed/failed.component';
import { PageTransactionSuccessComponent } from './pages/transaction/success/success.component';
import { PageTryAgainComponent } from './pages/try-again/try-again.component';
import { PageViewNotesComponent } from './pages/view-notes/view-notes.component';

import { AppRoutingModule } from './app-routing.module';

import { AddressSearchResultsComponent } from './components/address-search-results/address-search-results.component';
import { AddressTenantsResultsComponent } from './components/address-tenants-results/address-tenants-results.component';
import { AgentComponent } from './components/agent/agent.component';
import { BackLinkComponent } from './components/back-link/back-link.component';
import { BackLinkConfirmComponent } from './components/back-link-confirm/back-link-confirm.component';
import { BoxPanelComponent } from './components/panel/box-panel/box-panel.component';
import { CallNatureComponent } from './components/call-nature/call-nature.component';
import { CommsMethodSelectComponent } from './components/comms-method-select/comms-method-select.component';
import { CommsReceiptTemplatesComponent } from './components/comms-receipt-templates/comms-receipt-templates.component';
import { CommsTemplatesComponent } from './components/comms-templates/comms-templates.component';
import { ConfirmDialogueComponent } from './components/dialogue/confirm/confirm-dialogue.component';
import { ContentAreaComponent } from './components/content-area/content-area.component';
import { CurrentCallerComponent } from './components/current-caller/current-caller.component';
import { DPADialogueComponent } from './components/dialogue/dpa/dpa-dialogue.component';
import { DPATenancyComponent } from './components/dpatenancy/dpatenancy.component';
import { DateFieldComponent } from './components/date-field/date-field.component';
import { DialogueComponent } from './components/dialogue/dialogue.component';
import { DialogueTitleComponent } from './components/dialogue/title/dialogue-title.component';
import { EditorialComponent } from './components/editorial/editorial.component';
import { EnvNameComponent } from './components/env-name/env-name.component';
import { ErrorPanelComponent } from './components/panel/error-panel/error-panel.component';
import { HeadingComponent } from './components/panel/heading/heading.component';
import { HelperComponent } from './components/helper/helper.component';
import { LastCallsListComponent } from './components/last-calls-list/last-calls.component';
import { NoResultsComponent } from './components/no-results/no-results.component';
import { NoteFormComponent } from './components/note-form/note-form.component';
import { NotifyTemplatePreviewComponent } from './components/notify-template-preview/notify-template-preview.component';
import { OrComponent } from './components/or/or.component';
import { PanelComponent } from './components/panel/panel.component';
import { RouteLoadingComponent } from './components/route-loading/route-loading.component';
import { TabComponent } from './components/tabs/tab/tab.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { UHNotesComponent } from './components/uh-notes/uh-notes.component';
import { ValueListComponent } from './components/value-list/value-list.component';
import { ValueListLabelComponent } from './components/value-list/value-list-label/value-list-label.component';
import { ValueListValueComponent } from './components/value-list/value-list-value/value-list-value.component';
import { WarningComponent } from './components/warning/warning.component';

@NgModule({
    declarations: [
        AddressSearchResultsComponent,
        AddressTenantsResultsComponent,
        AgentComponent,
        AppComponent,
        BackLinkComponent,
        BackLinkConfirmComponent,
        BoxPanelComponent,
        CallNatureComponent,
        CommsMethodSelectComponent,
        CommsReceiptTemplatesComponent,
        CommsTemplatesComponent,
        ConfirmDialogueComponent,
        ContentAreaComponent,
        CurrentCallerComponent,
        DPADialogueComponent,
        DPATenancyComponent,
        DateFieldComponent,
        DialogueComponent,
        DialogueTitleComponent,
        EditorialComponent,
        EnvNameComponent,
        ErrorPanelComponent,
        HeadingComponent,
        HelperComponent,
        LastCallsListComponent,
        NavigationComponent,
        NoResultsComponent,
        NoteFormComponent,
        NotifyTemplatePreviewComponent,
        OrComponent,
        PageAuthComponent,
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
        PageRentSummaryComponent,
        PageRentTransactionsComponent,
        PageTransactionComponent,
        PageTransactionErrorComponent,
        PageTransactionFailedComponent,
        PageTransactionSuccessComponent,
        PageTryAgainComponent,
        PageViewNotesComponent,
        PanelComponent,
        RouteLoadingComponent,
        TabComponent,
        TabsComponent,
        TransactionsComponent,
        UHNotesComponent,
        ValueListComponent,
        ValueListLabelComponent,
        ValueListValueComponent,
        WarningComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,

        // Set up routing.
        AppRoutingModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [
        AccountDetailsResolver,
        CallerCanPayResolver,
        CallerResolver,
        CallNatureResolver,
        ContactDetailsResolver,
        IdentifiedCallerResolver
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }
