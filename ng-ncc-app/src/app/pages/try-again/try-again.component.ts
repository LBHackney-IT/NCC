import { Component, OnInit } from '@angular/core';

import { AUTH } from '../../constants/auth.constant';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-try-again',
    templateUrl: './try-again.component.html',
    styleUrls: ['./try-again.component.scss']
})
export class PageTryAgainComponent implements OnInit {

    reason: number;

    constructor(private Auth: AuthService) { }

    ngOnInit() {
        // We shouldn't see this page unless we couldn't log in for some reason. But what was the error?
        // The only way we can tell is through the message.
        switch (this.Auth.getMessage()) {
            case null:
                this.reason = AUTH.FAILED_PERMISSION;
                break;

            case 'Session for user login has been expired':
                this.reason = AUTH.FAILED_TIMEOUT;
                break;

            default:
                this.reason = AUTH.FAILED_NO_ACCESS;
        }
    }

    /**
     *
     */
    isTimeoutError(): boolean {
        return AUTH.FAILED_TIMEOUT === this.reason;
    }

    /**
     *
     */
    isAccessError(): boolean {
        return AUTH.FAILED_NO_ACCESS === this.reason;
    }

    /**
     *
     */
    isPermissionError(): boolean {
        return AUTH.FAILED_PERMISSION === this.reason;
    }

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
