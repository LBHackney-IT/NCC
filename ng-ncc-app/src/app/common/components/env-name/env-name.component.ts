import { environment } from '../../../../environments/environment';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-env-name',
    templateUrl: './env-name.component.html',
    styleUrls: ['./env-name.component.scss']
})
export class EnvNameComponent implements OnInit {

    display: boolean;

    /**
     *
     */
    ngOnInit() {
        // Don't display this component if we're in a production build.
        this.display = !environment.production;
    }

    /**
     *
     */
    getEnvironmentName(): string {
        return environment.name;
    }

}
