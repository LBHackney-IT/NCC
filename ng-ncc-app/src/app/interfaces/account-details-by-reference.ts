export interface IAccountDetailsByReference {
    accountid: string;
    tagReferenceNumber: string;
    benefit: number;
    propertyReferenceNumber: string;
    currentBalance: number;
    rent: number;
    housingReferenceNumber: string;
    directdebit: string | null;
    ListOfTenants: [
        {
            personNumber: string;
            responsible: boolean;
            title: string | null;
            forename: string;
            surname: string;
        }
    ];
    ListOfAddresses: [
        {
            postCode: string;
            shortAddress: string;
            addressTypeCode: string | null;
        }
    ];
}
