import { Component } from '@angular/core';

import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-try-again',
    templateUrl: './try-again.component.html',
    styleUrls: ['./try-again.component.scss']
})
export class PageTryAgainComponent {

    constructor(private Auth: AuthService) { }

    /**
     *
     */
    getAuthMessage(): string {
        return this.Auth.getMessage();
    }

    /**
     *
     */
    retry() {
        const location = window.location;
        const url = `${location.protocol}//${location.hostname}:4040`;
        window.open(url, '_self');
    }

}
