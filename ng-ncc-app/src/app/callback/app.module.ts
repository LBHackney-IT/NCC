import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { AppRoutingModule } from './app-routing.module';
import { ComponentModule } from '../common/component/component.module';
import { LayoutModule } from '../common/layout/layout.module';
import { PageRespondComponent } from './pages/respond/respond.component';

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
        ComponentModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})

export class AppModule { }
