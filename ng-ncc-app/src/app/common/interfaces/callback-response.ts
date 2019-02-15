export interface ICallbackResponse {
    callbackId: string;
    callReasonId: string;
    otherReason: string;
    gotThrough: boolean;
    responseBy: string; // an email address
    tenancyReference: string;
    notes: string;
    contactId: string;
    ticketNumber: string;
    serviceRequestId: string;
}
