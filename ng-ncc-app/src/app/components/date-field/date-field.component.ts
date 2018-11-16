import { Component, EventEmitter, Input, Output, OnChanges, OnInit } from '@angular/core';

import * as moment from 'moment';

@Component({
    selector: 'app-date-field',
    templateUrl: './date-field.component.html',
    styleUrls: ['./date-field.component.scss']
})
export class DateFieldComponent implements OnChanges, OnInit {
    @Input() date: string;
    @Input() format: string = 'DD/MM/YYYY';
    @Output() dateChange = new EventEmitter<string>();

    day: number;
    month: number;
    year: number;

    constructor() { }

    ngOnInit() {
    }

    ngOnChanges() {
        moment.locale('en-GB');
        const date = moment(this.date, this.format);
        if (date.isValid()) {
            this.day = date.date();
            this.month = date.month() + 1;
            this.year = date.year();
        }
    }

    /**
     * Returns TRUE if the day value is considered valid.
     */
    private isDayValid(): boolean {
        return 1 <= this.day && this.day <= 31;
    }

    /**
     * Returns TRUE if the month value is considered valid.
     */
    private isMonthValid(): boolean {
        return 1 <= this.month && this.month <= 12;
    }

    /**
     * Returns TRUE if the year value is considered valid.
     */
    private isYearValid(): boolean {
        return 1900 <= this.year && this.year <= 3000;
    }

    /**
     * Update the bound date if the values are considered valid.
     */
    updateDate() {
        if (!(this.isDayValid() && this.isMonthValid() && (this.isYearValid()))) {
            return;
        }

        const date = moment();
        date.date(this.day);
        date.month(this.month - 1); // aha!
        date.year(this.year);

        if (date.isValid()) {
            console.log('date changed', date.format(this.format));
            this.dateChange.emit(date.format(this.format));
        }
    }

}
