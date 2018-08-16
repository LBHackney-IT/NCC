// An interface for Citizen Index Search results provided by the Hackney API/microservice.
export interface CitizenIndexSearchResult {
    id?: any; // optional
    hackneyhomesId: string;
    title: string;
    surname: string;
    firstName: string;
    dateOfBirth: string;
    address?: any; // optional
    addressLine1: string;
    addressLine2: string;
    addressLine3: string;
    addressCity: string;
    addressCountry?: any; // optional
    postCode: string;
    systemName: string;
    larn: string;
    uprn: string;
    usn?: any; // optional
    fullAddressSearch: string;
    fullAddressDisplay: string;
    cautionaryAlert: boolean;
    propertyCautionaryAlert: boolean;
    crmContactId: string;
    emailAddress?: any; // optional
    telephone1: string;
    telephone2?: any; // optional
    telephone3: string;
    fullName: string;
    isActiveTenant: boolean;
    householdId: string;
    accounttype: string;
}
