import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';

import { NCCAPIService } from '../../../API/NCCAPI/ncc-api.service';

@Component({
    selector: 'app-page-respond',
    templateUrl: './respond.component.html',
    styleUrls: ['./respond.component.scss']
})
export class PageRespondComponent implements OnInit {

    callbackID: string;
    email: string;
    details: any;

    constructor(private route: ActivatedRoute, private NCCAPI: NCCAPIService) { }

    ngOnInit() {
        this.callbackID = this.route.snapshot.params.callbackID;
        this.email = this.route.snapshot.params.email;

        if (this.callbackID) {
            this.NCCAPI.getCallbackDetails(this.callbackID)
                .pipe(take(1))
                .subscribe(
                    (response) => { this.details = response; },
                    (error) => { console.log(error); }
                );
        } else {
            console.log('No callback ID provided.');
        }
    }
}
