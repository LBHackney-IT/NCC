// Information (apart from the contents of the note) required to save a note.
export interface IAddNoteParameters {
    call_id: string;
    ticket_number: string;
    call_reason_id: string;
    other_reason: string;
    crm_contact_id: string
    tenancy_reference: string | null;
}
