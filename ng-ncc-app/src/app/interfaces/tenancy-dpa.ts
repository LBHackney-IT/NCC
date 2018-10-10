export interface ITenancyDPA {
    rent_balance: number;
    rent_amount: number;
    tenancy_reference: string;
    // - current balance (multiply by -1);
    // - rent amount;
    // - data field (Mirella is adding this to API);
    // - property reference number.
}
