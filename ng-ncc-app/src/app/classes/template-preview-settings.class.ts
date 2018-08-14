export class TemplatePreviewSettings {
    template_id: string;
    version: number;

    constructor(template_id: string, version: number) {
        this.template_id = template_id;
        this.version = version;
    }
}
