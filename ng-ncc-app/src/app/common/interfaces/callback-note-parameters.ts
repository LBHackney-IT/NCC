export interface ICallbackNoteParameters {
    callbackId?: string;
    recipientEmail: string;
    managerEmail: string;
    callbackNumber: string;
    otherNumber?: string;
    message: string;
    callerName: string;
    tenancyReference: string;
    address: string;
    fromName: string;
}
