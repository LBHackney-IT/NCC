import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';

import { NotifyTemplatesResolver } from './resolvers/notify-templates-resolver.service';

import { PageHomeComponent } from './pages/home/home.component';
import { PageLogCallComponent } from './pages/log-call/log-call.component';
import { PageIdentifyComponent } from './pages/identify/identify.component';
import { PageCommsComponent } from './pages/comms/comms.component';
import { PagePlaygroundComponent } from './pages/playground/playground.component';

import { AppRoutingModule } from './/app-routing.module';

import { NoteFormComponent } from './components/note-form/note-form.component';
import { ContentAreaComponent } from './components/content-area/content-area.component';
import { CommsMethodSelectComponent } from './components/comms-method-select/comms-method-select.component';
import { NotifyTemplatePreviewComponent } from './components/notify-template-preview/notify-template-preview.component';
import { AddressSearchResultsComponent } from './components/address-search-results/address-search-results.component';
import { AddressTenantsResultsComponent } from './components/address-tenants-results/address-tenants-results.component';
import { NoResultsComponent } from './components/no-results/no-results.component';
import { BackLinkComponent } from './components/back-link/back-link.component';
import { DialogueComponent } from './components/dialogue/dialogue.component';
import { DialogueTitleComponent } from './components/dialogue/title/dialogue-title.component';

@NgModule({
    declarations: [
        AppComponent,
        NavigationComponent,
        PageHomeComponent,
        PageIdentifyComponent,
        PageLogCallComponent,
        PageCommsComponent,
        PagePlaygroundComponent,
        NoteFormComponent,
        ContentAreaComponent,
        CommsMethodSelectComponent,
        NotifyTemplatePreviewComponent,
        AddressSearchResultsComponent,
        AddressTenantsResultsComponent,
        NoResultsComponent,
        BackLinkComponent
        DialogueComponent,
        DialogueTitleComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,

        // Set up routing.
        AppRoutingModule
    ],
    providers: [
        NotifyTemplatesResolver
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }
