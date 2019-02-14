import { LogCallType } from '../classes/log-call-type.class';
import { LogCallReason } from '../classes/log-call-reason.class';

/**
 * This interface specifies a selected call type and reason.
 */
export class ILogCallSelection {
    call_type: LogCallType | null;
    call_reason: LogCallReason | null;
    other_reason?: string | null;
}
