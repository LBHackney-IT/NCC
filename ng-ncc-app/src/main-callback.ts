import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/callback/app.module';
import { environment } from './environments/environment';

if (environment.production) {
    enableProdMode();
}

if (environment.disable.consoleLogs) {
    window.console.log = function() { };
}

platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.log(err));
