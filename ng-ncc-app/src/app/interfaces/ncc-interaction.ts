export interface INCCInteraction {
    callReasonId: string;
    createdOn: string | null;
    govNotifyChannelType: number;
    govNotifyTemplateType: string | null;
    interactionId: string | null;
    notes: string | null
    notestype: number;
    paymentReference: string | null
    paymentStatus: number;
    serviceRequest: {
        contactId: string | null;
        createdBy: string | null
        createdDate: string | null
        description: string | null
        enquiryType: string | null
        id: string | null
        subject: string | null
        ticketNumber: string | null
        title: string | null
    }
}
