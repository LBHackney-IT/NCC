import { Component } from '@angular/core';

import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-agent',
    templateUrl: './agent.component.html',
    styleUrls: ['./agent.component.scss']
})
export class AgentComponent {

    name: string;

    constructor(private Auth: AuthService) { }

    getAgentName(): string {
        if (this.Auth.isLoggedIn()) {
            return this.Auth.getFullName();
        }
    }

}
