export interface ITenancyTransactionRow {
    date: string;
    description: string;
    in: number;
    out: number;
    balance: string; // formatted as a currency.
}
