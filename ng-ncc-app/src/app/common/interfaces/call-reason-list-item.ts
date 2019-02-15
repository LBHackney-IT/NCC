import { LogCallType } from '../classes/log-call-type.class';

export interface ICallReasonListItem {
    callTypeId: number;
    callTypeLabel: string;
    callReasonId: string;
    callReasonLabel: string;
}
