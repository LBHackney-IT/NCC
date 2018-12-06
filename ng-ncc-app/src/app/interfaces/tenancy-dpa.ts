export interface ITenancyDPA {
    rent_balance: number;        // - current balance (multiply by -1)
    rent_amount: number;         // - rent amount
    tenancy_reference: string;  // - property reference number.
    payment_reference: string;  // - payment reference number.


    // TODO - data field (Mirella is adding this to API);
}
