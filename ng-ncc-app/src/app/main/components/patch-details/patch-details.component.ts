import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { take } from 'rxjs/operators';

import { ManageATenancyAPIService } from '../../../common/API/ManageATenancyAPI/manageatenancy-api.service';

import { IAreaPatchResult } from '../../../common/interfaces/area-patch-result';

@Component({
    selector: 'app-patch-details',
    templateUrl: './patch-details.component.html',
    styleUrls: ['./patch-details.component.scss']
})
export class PatchDetailsComponent implements OnChanges {
    @Input() postcode: string;
    @Input() uprn: string;

    data: IAreaPatchResult;

    constructor(private ManageATenancyAPI: ManageATenancyAPIService) { }

    ngOnChanges(changes: SimpleChanges) {
        if (this.postcode && this.uprn) {
            this._getPatchInformation();
        }
    }

    private _getPatchInformation() {
        this.data = null;
        this.ManageATenancyAPI.getAreaPatch(this.postcode, this.uprn)
            .pipe(take(1))
            .subscribe((data: IAreaPatchResult) => {
                if (data.hackneyAreaId) {
                    // Sometimes we receive an empty object.
                    this.data = data;
                }
            });
    }

    /**
     *
     */
    get area(): string {
        return this.data ? this.data.hackneyareaName : null;
    }

    /**
     *
     */
    get ward(): string {
        return this.data ? this.data.hackneyWardName : null;
    }

    /**
     *
     */
    get managerName(): string {
        return this.data ? this.data.hackneyManagerPropertyPatchName : null;
    }

    /**
     *
     */
    get officerName(): string {
        return this.data ? this.data.hackneyEstateofficerPropertyPatchName : null;
    }

}
