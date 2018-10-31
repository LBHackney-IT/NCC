import { Component } from '@angular/core';

import { BackLinkService } from '../../services/back-link.service';

@Component({
    selector: 'app-back-link',
    templateUrl: './back-link.component.html',
    styleUrls: ['./back-link.component.css']
})
export class BackLinkComponent {

    constructor(private BackLink: BackLinkService) { }

    /**
     * Returns TRUE if the back link is intended to be visible.
     */
    isVisible(): boolean {
        return this.BackLink.visible;
    }

    /**
     * Returns the specified back link target.
     */
    getTarget(): string {
        return this.BackLink.target;
    }

}
