export interface TemplatePreviewSettings {
    template_id: string;
    version: number;
    parameters: { [propKey: string]: string };
}
