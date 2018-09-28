import { LogCallType } from '../classes/log-call-type.class';
import { LogCallReason } from '../classes/log-call-reason.class';

export class LogCallSelection {
    call_type: LogCallType | null;
    call_reason: LogCallReason | null;
}
