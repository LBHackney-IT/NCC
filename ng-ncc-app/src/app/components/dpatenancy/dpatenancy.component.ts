import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DPAService } from '../../services/dpa.service';

@Component({
    selector: 'app-dpa-tenancy',
    templateUrl: './dpatenancy.component.html',
    styleUrls: ['./dpatenancy.component.scss']
})
export class DPATenancyComponent implements OnInit, OnDestroy {
    @Input() crmContactID: string;

    private _destroyed$ = new Subject();

    constructor(private DPA: DPAService) { }

    /**
     *
     */
    ngOnInit() {
        this.DPA.buildAnswers(this.crmContactID)
            .pipe(
                takeUntil(this._destroyed$)
            )
            .subscribe();
    }

    /**
     *
     */
    ngOnDestroy() {
        this._destroyed$.next();
    }

    /**
     *
     */
    getTenancyDPAReference(): string {
        return this.DPA.getTenancyReference();
    }

    /**
     *
     */
    getTenancyDPABalance(): string {
        const result = this.DPA.getTenancyRentBalance();
        return result ? result.toString() : null;
    }

    /**
     *
     */
    getTenancyDPARent(): string {
        const result = this.DPA.getTenancyRentAmount();
        return result ? result.toString() : null;
    }

}
