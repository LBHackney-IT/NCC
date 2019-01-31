import { environment } from '../../../environments/environment';
import { Component } from '@angular/core';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

    isTestSite(): boolean {
        return !environment.production;
    }

}
