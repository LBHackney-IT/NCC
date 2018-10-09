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

}
