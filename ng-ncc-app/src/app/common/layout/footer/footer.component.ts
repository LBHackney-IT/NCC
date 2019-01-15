import { VERSION } from '../../../../environments/version';
import { Component } from '@angular/core';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

    /**
     * Returns the current version number.
     */
    getVersion(): string {
        const tag_string = VERSION.tag ? ` (${VERSION.tag})` : '';
        return `version ${VERSION.version}${tag_string}`;
    }

}
