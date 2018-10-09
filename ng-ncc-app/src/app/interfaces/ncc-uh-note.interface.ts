export interface NCCUHNote {
    notes: string;
    notesType: string;
    callType: string;
    callReasonType: string;
    clientName: string;
    createdBy: string;
    createdOn: string; // timestamp
    createdOnSort?: string; // timestamp
}
