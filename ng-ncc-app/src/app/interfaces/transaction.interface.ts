export interface Transaction {
    tagReference: string;
    propertyReference: string;
    transactionSid: string | null;
    houseReference: string;
    transactionType: string;
    postDate: string;   // timestamp
    realValue: number;
    transactionID: string;
    debDesc: string;
    balance?: number; // currently calculated by the app.
}
