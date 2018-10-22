export interface IParisResponse {
    authorisationcode: string;
    receiptnumber: string;
    transactiontype: string;
    merchantnumber: string;
    data: string;
    serviceprocessed: boolean;
    merchanttid: string;
    amount: number;
    date: string;
    administrationcharge: number;
    hash: string;
}
