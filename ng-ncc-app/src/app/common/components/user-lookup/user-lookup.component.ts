import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { IActiveDirectoryUserResult } from '../../interfaces/active-directory-user-result';
import { Subject, of } from '../../../../../node_modules/rxjs';
import { debounceTime, distinctUntilChanged, take } from '../../../../../node_modules/rxjs/operators';
import { NCCAPIService } from '../../API/NCCAPI/ncc-api.service';

@Component({
    selector: 'app-user-lookup',
    templateUrl: './user-lookup.component.html',
    styleUrls: ['./user-lookup.component.scss']
})
export class UserLookupComponent {
    @Input() model: string;
    @Output() modelChange = new EventEmitter<string>();

    @Input() placeholder: string;

    protected userList: IActiveDirectoryUserResult[];
    protected txtQuery: string; // bind this to input with ngModel
    protected txtQueryChanged = new Subject<string>();

    constructor(private NCCAPI: NCCAPIService) {
        this.userList = [];
        this.txtQueryChanged
            .pipe(
                debounceTime(1000),    // wait 1 sec after the last event before emitting last event
                distinctUntilChanged() // only emit if value is different from previous value
            )
            .subscribe(model => {
                this.txtQuery = model;

                // Call your function which calls API or do anything you would like do after a lag of 1 sec
                this.updateList();
            });
    }

    onFieldChange(query: string) {
        this.txtQueryChanged.next(query);
    }

    updateList() {
        // this.NCCAPI.getUsersListFromActiveDirectory(this.txtQuery)
        //     .pipe(take(1))
        //     .subscribe((list: IActiveDirectoryUserResult[]) => {
        //         this.userList = list;
        //     });
        of([
            {
                "name": "Andrew Price",
                "email": "Andrew.Price@Hackney.gov.uk",
                "username": "aprice"
            },
            {
                "name": "Andrew Walker",
                "email": "Andrew.Walker@Hackney.gov.uk",
                "username": "anwalker"
            },
            {
                "name": "Andrew Salmon",
                "email": "andrew.salmon@northgate-is.com",
                "username": ""
            },
            {
                "name": "Hazel Drew",
                "email": "Hazel.Drew@newhamhealth.nhs.uk",
                "username": ""
            },
            {
                "name": "Claire Andrews",
                "email": "Claire.Andrews@newham.gov.uk",
                "username": ""
            },
            {
                "name": "Andrew McGovern",
                "email": "Andrew.McGovern@newhamhealth.nhs.uk",
                "username": ""
            },
            {
                "name": "Sawczenko Andrew at Homerton Hospital NHS Trust",
                "email": "andrew.sawczenko@homerton.nhs.uk",
                "username": ""
            },
            {
                "name": "Andrew Manning",
                "email": "Andrew.Manning@newham.gov.uk",
                "username": ""
            },
            {
                "name": "Andrew Beattie",
                "email": "Andrew.Beattie@newham.gov.uk",
                "username": ""
            },
            {
                "name": "Andrew Frazer",
                "email": "Andrew.Frazer@newhamhealth.nhs.uk",
                "username": ""
            },
            {
                "name": "Dunbar Andrew at Homerton Hospital NHS Trust",
                "email": "Andrew.Dunbar@homerton.nhs.uk",
                "username": ""
            },
            {
                "name": "Andrews Alexandra",
                "email": "alexandra.andrews@thpct.nhs.uk",
                "username": ""
            },
            {
                "name": "Andrew Howard",
                "email": "Andrew.Howard@newham.gov.uk",
                "username": ""
            },
            {
                "name": "Twist, Andrew",
                "email": "andrew.twist@gp-F84062.nhs.uk",
                "username": ""
            },
            {
                "name": "Panniker Andrew at Homerton Hospital NHS Trust",
                "email": "Andrew.Panniker@homerton.nhs.uk",
                "username": ""
            },
            {
                "name": "Andrew Drennan",
                "email": "Andrew.Drennan@newham.gov.uk",
                "username": ""
            }])
            .subscribe((list: IActiveDirectoryUserResult[]) => {
                this.userList = list;
            });
    }

    hideResults() {
        this.userList = [];
    }

    selectedOption(option: IActiveDirectoryUserResult) {
        console.log('Selected', option);
        this.modelChange.emit(option.email);
        this.hideResults();
        this.txtQuery = option.email;
    }
}
