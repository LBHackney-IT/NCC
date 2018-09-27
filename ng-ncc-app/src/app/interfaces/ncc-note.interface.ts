export interface NCCNote {
    interactionId: string;
    serviceRequestId: string;
    ticketNumber: string;
    notes: string;
    notesType: string;
    callReasonType: string;
    createdOn: string; // timestamp
}
