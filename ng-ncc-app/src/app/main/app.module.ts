import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { ChecklistModule } from 'angular-checklist';

import { AppComponent } from './app.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { LayoutModule } from '../common/layout/layout.module';
import { ComponentsModule } from '../common/components/components.module';

import { HelperService } from '../common/services/helper.service';
import { WindowService } from '../common/services/window.service';

import { AccountDetailsResolver } from './resolvers/account-details-resolver.service';
import { ContactDetailsResolver } from './resolvers/contact-details-resolver.service';

import { CallerCanMakePaymentGuard } from './guard/caller-can-make-payment.guard';
import { IsCallerAvailableGuard } from './guard/is-caller-available.guard';
import { IsIdentifiedCallerGuard } from './guard/is-identified-caller.guard';
import { IsIdentifiedOrNonTenantCallerGuard } from './guard/is-identified-or-non-tenant-caller.guard';

import { PageAddNotesComponent } from './pages/add-notes/add-notes.component';
import { PageAuthComponent } from './pages/auth/auth.component';
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

import { AppRoutingModule } from './app-routing.module';

import { AddressResultTenantComponent } from './components/address-tenants-results/tenant/tenant.component';
import { AddressSearchResultsComponent } from './components/address-search-results/address-search-results.component';
import { AddressTenantsResultsComponent } from './components/address-tenants-results/address-tenants-results.component';
import { BackLinkComponent } from './components/back-link/back-link.component';
import { CallNatureComponent } from './components/call-nature/call-nature.component';
import { CallNatureDropdownComponent } from './components/call-nature-dropdown/call-nature-dropdown.component';
import { CommsMethodSelectComponent } from './components/comms-method-select/comms-method-select.component';
import { CommsReceiptTemplatesComponent } from './components/comms-receipt-templates/comms-receipt-templates.component';
import { CommsTemplatesComponent } from './components/comms-templates/comms-templates.component';
import { ConfirmDialogueComponent } from './components/dialogue/confirm/confirm-dialogue.component';
import { DPADialogueComponent } from './components/dialogue/dpa/dpa-dialogue.component';
import { DPATenancyComponent } from './components/dpa-tenancy/dpa-tenancy.component';
import { DateFieldComponent } from './components/date-field/date-field.component';
import { DialogueComponent } from './components/dialogue/dialogue.component';
import { DialogueTitleComponent } from './components/dialogue/title/dialogue-title.component';
import { EditorialComponent } from './components/editorial/editorial.component';
import { HelperComponent } from './components/helper/helper.component';
import { LastCallsListComponent } from './components/last-calls-list/last-calls.component';
import { NoResultsComponent } from './components/no-results/no-results.component';
import { NoteFormComponent } from './components/note-form/note-form.component';
import { NoteTypeComponent } from './components/note-type/note-type.component';
import { NotifyTemplatePreviewComponent } from './components/notify-template-preview/notify-template-preview.component';
import { OrComponent } from './components/or/or.component';
import { TabComponent } from './components/tabs/tab/tab.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { UHNotesComponent } from './components/uh-notes/uh-notes.component';
import { ValueListComponent } from './components/value-list/value-list.component';
import { ValueListLabelComponent } from './components/value-list/value-list-label/value-list-label.component';
import { ValueListValueComponent } from './components/value-list/value-list-value/value-list-value.component';
import { WarningComponent } from './components/warning/warning.component';
import { AccountBalanceComponent } from './components/account-balance/account-balance.component';
import { TenancyTypeComponent } from './components/tenancy-type/tenancy-type.component';
import { NumbersOnlyDirective } from './directives/numbers-only.directive';
import { RentBreakdownComponent } from './components/rent-breakdown/rent-breakdown.component';
import { CallNatureDialogueComponent } from './components/call-nature-dialogue/call-nature-dialogue.component';
import { CurrentBalanceComponent } from './components/current-balance/current-balance.component';
import { DisplayBalanceComponent } from './components/display-balance/display-balance.component';
import { CommsTelephoneComponent } from './components/comms-telephone/comms-telephone.component';

@NgModule({
    declarations: [
        AccountBalanceComponent,
        AddressResultTenantComponent,
        AddressSearchResultsComponent,
        AddressTenantsResultsComponent,
        AppComponent,
        BackLinkComponent,
        CallNatureComponent,
        CallNatureDialogueComponent,
        CallNatureDropdownComponent,
        CommsMethodSelectComponent,
        CommsReceiptTemplatesComponent,
        CommsTelephoneComponent,
        CommsTemplatesComponent,
        ConfirmDialogueComponent,
        CurrentBalanceComponent,
        DateFieldComponent,
        DialogueComponent,
        DialogueTitleComponent,
        DisplayBalanceComponent,
        DPADialogueComponent,
        DPATenancyComponent,
        EditorialComponent,
        HelperComponent,
        LastCallsListComponent,
        NavigationComponent,
        NoResultsComponent,
        NoteFormComponent,
        NoteTypeComponent,
        NotifyTemplatePreviewComponent,
        NumbersOnlyDirective,
        OrComponent,
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
        RentBreakdownComponent,
        TabComponent,
        TabsComponent,
        TenancyTypeComponent,
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

        ChecklistModule,

        LayoutModule,
        ComponentsModule,

        // Set up routing.
        AppRoutingModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [
        AccountDetailsResolver,
        CallerCanMakePaymentGuard,
        IsCallerAvailableGuard,
        ContactDetailsResolver,
        IsIdentifiedCallerGuard,
        IsIdentifiedOrNonTenantCallerGuard,
        WindowService,
        HelperService
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }
