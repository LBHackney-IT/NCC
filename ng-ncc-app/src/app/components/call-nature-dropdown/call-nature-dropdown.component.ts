import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Observable, forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CallNatureComponent } from '../call-nature/call-nature.component';
import { HackneyAPIService } from '../../API/HackneyAPI/hackney-api.service';
import { ILogCallSelection } from '../../interfaces/log-call-selection';
import { LogCallReason } from '../../classes/log-call-reason.class';
import { LogCallType } from '../../classes/log-call-type.class';
import { CALL_REASON } from '../../constants/call-reason.constant';

@Component({
    selector: 'app-call-nature-dropdown',
    templateUrl: './call-nature-dropdown.component.html',
    styleUrls: ['./call-nature-dropdown.component.scss']
})
export class CallNatureDropdownComponent extends CallNatureComponent {

    @Input() disabled: boolean;

    /**
     *
     */
    canSelectCallReason(): boolean {
        return !this.disabled && this.isCallTypeSelected() && undefined !== this.call_reasons;
    }

}
