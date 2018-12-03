export interface IAccountDetails {
    propertyReferenceNumber: string;
    benefit: number;
    tagReferenceNumber: string;
    accountid: string;
    currentBalance: number;
    rent: number;
    housingReferenceNumber: string;
    paymentReferenceNumber: string;
    directdebit: any;
    personNumber: any;
    responsible: boolean;
    title: string | null;
    forename: string | null;
    surname: string | null;
    tenuretype: string;
    agreementType: string;
    isAgreementTerminated: boolean;
}
