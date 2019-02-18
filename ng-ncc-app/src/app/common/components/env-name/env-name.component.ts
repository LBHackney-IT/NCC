import { environment } from '../../../../environments/environment';
import { Component } from '@angular/core';

@Component({
    selector: 'app-env-name',
    templateUrl: './env-name.component.html',
    styleUrls: ['./env-name.component.scss']
})
export class EnvNameComponent {

    /**
     *
     */
    getEnvironmentName(): string {
        return environment.name;
    }

}
