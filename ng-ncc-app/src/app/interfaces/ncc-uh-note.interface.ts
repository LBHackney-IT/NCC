export interface NCCUHNote {
    notes: string;
    notesType: string;
    callType: string;
    callReasonType: string;
    createdBy: string;
    createdOn: string; // timestamp
    createdOnSort?: string; // timestamp
}
