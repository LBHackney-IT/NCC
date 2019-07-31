import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AccountBalanceComponent } from './account-balance/account-balance.component';
import { AddressSearchResultsComponent } from './address-search-results/address-search-results.component';
import { AddressTenantsResultsComponent } from './address-tenants-results/address-tenants-results.component';
import { CallRevisionCallerComponent } from './call-revision-caller/call-revision-caller.component';
import { CallRevisionAddressComponent } from './call-revision-address/call-revision-address.component';
import { CommsMethodSelectComponent } from './comms-method-select/comms-method-select.component';
import { CommsReceiptTemplatesComponent } from './comms-receipt-templates/comms-receipt-templates.component';
import { CommsTemplatesComponent } from './comms-templates/comms-templates.component';
import { CommsTelephoneComponent } from './comms-telephone/comms-telephone.component';
import { SensitiveCommsTemplatesComponent } from './sensitive-comms-templates/sensitive-comms-templates.component';
import { DateFieldComponent } from './date-field/date-field.component';
import { CurrentBalanceComponent } from './current-balance/current-balance.component';
import { ConfirmDialogueComponent } from './dialogue/confirm/confirm-dialogue.component';
import { DialogueComponent } from './dialogue/dialogue.component';
import { DisplayBalanceComponent } from './display-balance/display-balance.component';
import { DialogueTitleComponent } from './dialogue/title/dialogue-title.component';
import { EditorialComponent } from './editorial/editorial.component';
import { DPATenancyComponent } from './dpa-tenancy/dpa-tenancy.component';
import { DPADialogueComponent } from './dialogue/dpa/dpa-dialogue.component';
import { PatchDetailsComponent } from './patch-details/patch-details.component';
import { UHNotesComponent } from './uh-notes/uh-notes.component';
import { TenancyTypeComponent } from './tenancy-type/tenancy-type.component';
import { RentBreakdownComponent } from './rent-breakdown/rent-breakdown.component';
import { NotifyTemplatePreviewComponent } from './notify-template-preview/notify-template-preview.component';
import { NoteTypeComponent } from './note-type/note-type.component';
import { NavigationComponent } from './navigation/navigation.component';
import { LastCallsListComponent } from './last-calls-list/last-calls.component';
import { NoResultsComponent } from './no-results/no-results.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { CommonComponentsModule } from 'src/app/common/components/components.module';
import { AddressResultTenantComponent } from './address-tenants-results/tenant/tenant.component';
import { ChecklistModule } from 'angular-checklist';
import { OrModule } from 'src/app/common/components/or/or.module';
import { PanelModule } from '../../common/components/panel/panel.module';
import { ValueListModule } from '../../common/components/value-list/value-list.module';
import { CallNatureModule } from 'src/app/main/components/call-nature/call-nature.module';
import { HelperModule } from 'src/app/main/components/helper/helper.module';

@NgModule({
    imports: [
        CommonModule,
        CommonComponentsModule,
        CallNatureModule,
        ChecklistModule,
        FormsModule,
        RouterModule,
        HelperModule,
        OrModule,
        PanelModule,
        ValueListModule
    ],
    declarations: [
        AccountBalanceComponent,
        AddressSearchResultsComponent,
        AddressTenantsResultsComponent,
        AddressResultTenantComponent,
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
        LastCallsListComponent,
        NavigationComponent,
        NoResultsComponent,
        NoteTypeComponent,
        NotifyTemplatePreviewComponent,
        RentBreakdownComponent,
        SensitiveCommsTemplatesComponent,
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
        LastCallsListComponent,
        NavigationComponent,
        NoResultsComponent,
        NoteTypeComponent,
        NotifyTemplatePreviewComponent,
        RentBreakdownComponent,
        SensitiveCommsTemplatesComponent,
        TenancyTypeComponent,
        TransactionsComponent,
        UHNotesComponent,
        PatchDetailsComponent,
    ]
})
export class MainComponentsModule { }
