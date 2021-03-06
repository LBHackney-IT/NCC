export interface INotesSettings {
    call_id: string;
    ticket_number: string;
    call_reason_id: string;
    other_reason: string | null;
    existing_repair_contractor_reason: string | null;
    crm_contact_id: string;
    content: string;
    calltransferred?: boolean;
    tenancy_reference?: string;
    parameters?: { [propKey: string]: string | number | object };
}
