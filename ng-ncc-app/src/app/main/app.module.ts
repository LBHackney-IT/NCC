import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LayoutModule } from '../common/layout/layout.module';
import { CommonComponentsModule } from '../common/components/components.module';

import { HelperService } from '../common/services/helper.service';
import { WindowService } from '../common/services/window.service';

import { AccountDetailsResolver } from './resolvers/account-details-resolver.service';
import { ContactDetailsResolver } from './resolvers/contact-details-resolver.service';

import { CallerCanMakePaymentGuard } from './guard/caller-can-make-payment.guard';
import { IsCallerAvailableGuard } from './guard/is-caller-available.guard';
import { IsIdentifiedCallerGuard } from './guard/is-identified-caller.guard';
import { IsIdentifiedOrNonTenantCallerGuard } from './guard/is-identified-or-non-tenant-caller.guard';

import { AppRoutingModule } from './app-routing.module';

import { MainComponentsModule } from 'src/app/main/components/main-components.module';
import { MainPagesModule } from './pages/main-pages.module';
import { DraggableModule } from '../common/directives/draggable/draggable.module';

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,

        LayoutModule,
        DraggableModule,
        MainPagesModule,
        MainComponentsModule,
        CommonComponentsModule,

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
