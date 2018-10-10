import { ILogCallSelection } from '../../interfaces/log-call-selection';
import { LogCallReason } from '../../classes/log-call-reason.class';
import { LogCallType } from '../../classes/log-call-type.class';

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
        return this.selectionExists() && this.selected.call_reason instanceof LogCallReason;
    }

    /**
     * This is called when the call type is set/changed, and resets the selected call reason.
     */
    proceed() { }

}
