import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { NavigationComponent } from './components/navigation/navigation.component';

import { AccountDetailsResolver } from './resolvers/account-details-resolver.service';
import { CallerResolver } from './resolvers/caller-resolver.service';
import { CallNatureResolver } from './resolvers/call-nature-resolver.service';
import { ContactDetailsResolver } from './resolvers/contact-details-resolver.service';
import { IdentifiedCallerResolver } from './resolvers/identified-caller-resolver.service';

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

import { AppRoutingModule } from './/app-routing.module';

import { AddressSearchResultsComponent } from './components/address-search-results/address-search-results.component';
import { AddressTenantsResultsComponent } from './components/address-tenants-results/address-tenants-results.component';
import { BackLinkComponent } from './components/back-link/back-link.component';
import { BackLinkConfirmComponent } from './components/back-link-confirm/back-link-confirm.component';
import { CommsMethodSelectComponent } from './components/comms-method-select/comms-method-select.component';
import { CommsTemplatesComponent } from './components/comms-templates/comms-templates.component';
import { CommunicationsPageComponent } from './components/communications-page/communications-page.component';
import { ConfirmDialogueComponent } from './components/dialogue/confirm/confirm-dialogue.component';
import { ContentAreaComponent } from './components/content-area/content-area.component';
import { DialogueComponent } from './components/dialogue/dialogue.component';
import { DialogueTitleComponent } from './components/dialogue/title/dialogue-title.component';
import { DPADialogueComponent } from './components/dialogue/dpa/dpa-dialogue.component';
import { HelperComponent } from './components/helper/helper.component';
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
import { CallNatureComponent } from './components/call-nature/call-nature.component';

@NgModule({
    declarations: [
        AppComponent,
        NavigationComponent,
        AddressSearchResultsComponent,
        AddressTenantsResultsComponent,
        BackLinkComponent,
        BackLinkConfirmComponent,
        CommsMethodSelectComponent,
        CommsTemplatesComponent,
        CommunicationsPageComponent,
        ConfirmDialogueComponent,
        ContentAreaComponent,
        DialogueComponent,
        DialogueTitleComponent,
        DPADialogueComponent,
        HelperComponent,
        NoResultsComponent,
        NoteFormComponent,
        NotifyTemplatePreviewComponent,
        OrComponent,
        PageCommsComponent,
        PageContactDetailsComponent,
        PageHomeComponent,
        PageIdentifyComponent,
        PageLogAdditionalComponent,
        PageLogCallComponent,
        PagePaymentComponent,
        PagePaymentMakeComponent,
        PagePaymentSummaryComponent,
        PagePlaygroundComponent,
        PageRentCommunicationsComponent,
        PageTransactionHistoryComponent,
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
        CallNatureComponent,
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
        CallerResolver,
        CallNatureResolver,
        ContactDetailsResolver,
        IdentifiedCallerResolver
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }
