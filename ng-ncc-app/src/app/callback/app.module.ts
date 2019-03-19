import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { AppRoutingModule } from './app-routing.module';
import { CommonComponentsModule } from '../common/components/components.module';
import { LayoutModule } from '../common/layout/layout.module';
import { PageRespondComponent } from './pages/respond/respond.component';
import { PanelModule } from 'src/app/common/components/panel/panel.module';

@NgModule({
    declarations: [
        AppComponent,
        PageRespondComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,

        // Set up routing.
        AppRoutingModule,

        LayoutModule,
        CommonComponentsModule,
        PanelModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})

export class AppModule { }
