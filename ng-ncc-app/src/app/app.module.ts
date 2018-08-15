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
import { AppRoutingModule } from './/app-routing.module';
import { NoteFormComponent } from './components/note-form/note-form.component';
import { ContentAreaComponent } from './components/content-area/content-area.component';
import { CommsMethodSelectComponent } from './components/comms-method-select/comms-method-select.component';
import { NotifyTemplatePreviewComponent } from './components/notify-template-preview/notify-template-preview.component';

@NgModule({
    declarations: [
        AppComponent,
        NavigationComponent,
        PageHomeComponent,
        PageIdentifyComponent,
        PageLogCallComponent,
        PageCommsComponent,
        NoteFormComponent,
        ContentAreaComponent,
        CommsMethodSelectComponent,
        NotifyTemplatePreviewComponent
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
