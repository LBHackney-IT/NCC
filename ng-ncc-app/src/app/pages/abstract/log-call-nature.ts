import { ILogCallSelection } from '../../interfaces/log-call-selection';
import { LogCallReason } from '../../classes/log-call-reason.class';
import { LogCallType } from '../../classes/log-call-type.class';
import { CALL_REASON } from '../../constants/call-reason.constant';

export class PageLogCallNature {

    selected: ILogCallSelection;

    /**
     *
     */
    selectedCallNature(selection: ILogCallSelection) {
        this.selected = selection;
    }

    /**
     *
     */
    selectionExists(): boolean {
        return this.selected instanceof ILogCallSelection;
    }

    /**
     * Returns TRUE if we should be able to proceed.
     */
    canProceed(): boolean {
        return this.isCallTypeSelected() && this.isCallReasonSelected();
    }

    /**
     *
     */
    isCallTypeSelected(): boolean {
        return this.selectionExists() && this.selected.call_type instanceof LogCallType;
    }

    /**
     *
     */
    isCallReasonSelected(): boolean {
        if (this.selectionExists() && this.selected.call_reason instanceof LogCallReason) {
            console.log('call reason:', this.selected.call_reason.label, this.selected.other_reason);
            if (CALL_REASON.OTHER === this.selected.call_reason.id) {
                return (undefined !== this.selected.other_reason) && (this.selected.other_reason.trim().length > 0);
            }
            return true;
        }
        return false;
    }

    /**
     * This is called when the call type is set/changed, and resets the selected call reason.
     */
    proceed() { }

}
