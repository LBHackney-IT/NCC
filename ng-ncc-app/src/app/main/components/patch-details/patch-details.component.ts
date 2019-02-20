import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ManageATenancyAPIService } from '../../../common/API/ManageATenancyAPI/manageatenancy-api.service';
import { take } from 'rxjs/operators';

@Component({
    selector: 'app-patch-details',
    templateUrl: './patch-details.component.html',
    styleUrls: ['./patch-details.component.scss']
})
export class PatchDetailsComponent implements OnChanges {
    @Input() postcode: string;
    @Input() uprn: string;

    data: {};

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
            .subscribe((data) => {
                this.data = data;
            });
    }

}
