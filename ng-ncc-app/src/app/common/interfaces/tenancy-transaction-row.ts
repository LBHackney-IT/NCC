export interface ITenancyTransactionRow {
    date: string;
    dateSort: string;
    description: string;
    in: number;
    out: number;
    balance: string; // formatted as a currency.
}
