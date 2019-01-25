export interface INotifyStatementParameters {
    ContactId: string;
    StartDate: string;
    EndDate: string;
    EmailTo: string;
    TemplateId: string;
    TemplateData: { [propKey: string]: string | number };
}
