export interface ICRMServiceRequest {
    id: string;
    title: string;
    description: string;
    contactId: string;
    parentCaseId: string | null;
    subject: string;
    createdDate: null;
    enquiryType: null;
    ticketNumber: string;   // required to create notes.
    requestCallback: boolean;
    transferred: boolean;
    createdBy: null;
    childRequests: null;
}
