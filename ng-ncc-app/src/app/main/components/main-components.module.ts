import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AccountBalanceComponent } from './account-balance/account-balance.component';
import { AddressSearchResultsComponent } from './address-search-results/address-search-results.component';
import { AddressTenantsResultsComponent } from './address-tenants-results/address-tenants-results.component';
import { CallNatureComponent } from './call-nature/call-nature.component';
import { CallNatureDialogueComponent } from './call-nature-dialogue/call-nature-dialogue.component';
import { CallNatureDropdownComponent } from './call-nature-dropdown/call-nature-dropdown.component';
import { CallRevisionCallerComponent } from './call-revision-caller/call-revision-caller.component';
import { CallRevisionAddressComponent } from './call-revision-address/call-revision-address.component';
import { CommsMethodSelectComponent } from './comms-method-select/comms-method-select.component';
import { CommsReceiptTemplatesComponent } from './comms-receipt-templates/comms-receipt-templates.component';
import { CommsTemplatesComponent } from './comms-templates/comms-templates.component';
import { CommsTelephoneComponent } from './comms-telephone/comms-telephone.component';
import { DateFieldComponent } from './date-field/date-field.component';
import { CurrentBalanceComponent } from './current-balance/current-balance.component';
import { ConfirmDialogueComponent } from './dialogue/confirm/confirm-dialogue.component';
import { DialogueComponent } from './dialogue/dialogue.component';
import { DisplayBalanceComponent } from './display-balance/display-balance.component';
import { DialogueTitleComponent } from './dialogue/title/dialogue-title.component';
import { HelperComponent } from './helper/helper.component';
import { EditorialComponent } from './editorial/editorial.component';
import { DPATenancyComponent } from './dpa-tenancy/dpa-tenancy.component';
import { DPADialogueComponent } from './dialogue/dpa/dpa-dialogue.component';
import { PatchDetailsComponent } from './patch-details/patch-details.component';
import { UHNotesComponent } from './uh-notes/uh-notes.component';
import { TenancyTypeComponent } from './tenancy-type/tenancy-type.component';
import { RentBreakdownComponent } from './rent-breakdown/rent-breakdown.component';
import { NotifyTemplatePreviewComponent } from './notify-template-preview/notify-template-preview.component';
import { NoteTypeComponent } from './note-type/note-type.component';
import { NoteFormComponent } from './note-form/note-form.component';
import { NavigationComponent } from './navigation/navigation.component';
import { LastCallsListComponent } from './last-calls-list/last-calls.component';
import { NoResultsComponent } from './no-results/no-results.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { CommonComponentsModule } from 'src/app/common/components/components.module';
import { AddressResultTenantComponent } from './address-tenants-results/tenant/tenant.component';
import { ChecklistModule } from 'angular-checklist';

@NgModule({
    imports: [
        CommonModule,
        CommonComponentsModule,
        ChecklistModule,
        FormsModule,
        RouterModule
    ],
    declarations: [
        AccountBalanceComponent,
        AddressSearchResultsComponent,
        AddressTenantsResultsComponent,
        AddressResultTenantComponent,
        CallNatureComponent,
        CallNatureDialogueComponent,
        CallNatureDropdownComponent,
        CallRevisionCallerComponent,
        CallRevisionAddressComponent,
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
        RentBreakdownComponent,
        TenancyTypeComponent,
        TransactionsComponent,
        UHNotesComponent,
        PatchDetailsComponent,
    ],
    exports: [
        AccountBalanceComponent,
        AddressSearchResultsComponent,
        AddressTenantsResultsComponent,
        AddressResultTenantComponent,
        CallNatureComponent,
        CallNatureDialogueComponent,
        CallNatureDropdownComponent,
        CallRevisionCallerComponent,
        CallRevisionAddressComponent,
        CurrentBalanceComponent,
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
        RentBreakdownComponent,
        TenancyTypeComponent,
        TransactionsComponent,
        UHNotesComponent,
        PatchDetailsComponent,
    ]
})
export class MainComponentsModule { }
