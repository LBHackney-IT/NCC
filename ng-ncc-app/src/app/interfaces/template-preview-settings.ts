export interface ITemplatePreviewSettings {
    template_id: string;
    version: number;
    parameters: { [propKey: string]: any };
}
