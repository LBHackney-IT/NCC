export interface INotifyStatementParameters {
    ContactId: string;
    TenancyReference: string;
    StartDate: string;
    EndDate: string;
    EmailTo: string;
    TemplateId: string;
    TemplateData: { [propKey: string]: string | number };
}
