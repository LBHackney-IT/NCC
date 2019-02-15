import { environment } from '../../../../environments/environment';
import { Component, HostBinding } from '@angular/core';

@Component({
    selector: 'app-layout-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class LayoutHeaderComponent {

    // Add a class to this component if we are not on a PRODUCTION version of the site.
    @HostBinding('class.is-test-site')
    get isTestSite(): boolean {
        return !environment.production;
    }

}
