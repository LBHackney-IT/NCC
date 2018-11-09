export interface IParisResponse {
    authorisationcode: string;
    receiptnumber: string;
    transactiontype: string;
    merchantnumber: string;
    data: string;
    serviceprocessed: string;
    merchanttid: string;
    amount: number;
    date: string;
    administrationcharge: number;
    error?: string;

    // we create these via payment.html.
    interactionId: string;
    username: string;
    original_amount: number;
}
