import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';

import AppRoutes from './app.routes';

import { PageHomeComponent } from './pages/home/home.component';
import { PageLogCallComponent } from './pages/log-call/log-call.component';
import { PageIdentifyComponent } from './pages/identify/identify.component';
import { PageCommsComponent } from './pages/comms/comms.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    PageHomeComponent,
    PageIdentifyComponent,
    PageLogCallComponent,
    PageCommsComponent
  ],
  imports: [
    BrowserModule,

    // Set up routing.
    RouterModule.forRoot(
      AppRoutes
    )

  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
