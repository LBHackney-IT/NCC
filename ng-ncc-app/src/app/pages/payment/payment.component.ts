import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';

import { IParisResponse } from '../../interfaces/paris-response';

@Component({
    selector: 'app-payment',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.css']
})
export class PagePaymentComponent implements OnInit {

    private _data: IParisResponse;
    constructor(private route: ActivatedRoute) { }

    /**
     *
     */
    ngOnInit() {
        this.getData();
    }

    /**
     *
     */
    getData() {
        this.route.paramMap
            .subscribe((params) => {
                // Data will be sent to this page in the form of a custom string. The string is generated by a payment.html page, which
                // receives the query string from Paris.
                // We had to do this because Angular routes don't like ampersands (&) or the equals sign in parameters.
                this._data = this._processData(params.get('data'));
                console.log('Payment data:', this._data);
            });
    }

    /**
     *
     */
    private _processData(query: string): IParisResponse {
        // https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_frompairs
        const fromPairs = function(arr) {
            return arr.reduce(function(accumulator, value) {
                accumulator[value[0]] = decodeURIComponent(value[1]);
                return accumulator;
            }, {});
        };

        const data = query.split('$').map((row) => row.split(':'));
        return fromPairs(data);
    }

}
