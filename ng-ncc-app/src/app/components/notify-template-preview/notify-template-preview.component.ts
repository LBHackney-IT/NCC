import { Component, Input, OnChanges, OnInit, SimpleChange } from '@angular/core';
import { NotifyAPIService } from '../../API/NotifyAPI/notify-api.service';
import { TemplatePreviewSettings } from '../../classes/template-preview-settings.class';

@Component({
    selector: 'app-notify-template-preview',
    templateUrl: './notify-template-preview.component.html',
    styleUrls: ['./notify-template-preview.component.scss']
})
export class NotifyTemplatePreviewComponent implements OnInit, OnChanges {
    @Input() settings: TemplatePreviewSettings;

    _loading: boolean;
    preview: string;
    placeholders: { [propKey: string]: string };

    constructor(private NotifyAPI: NotifyAPIService) { }

    ngOnInit() {
        this._loading = false;
        this.preview = 'testing';
    }

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        // TODO display a loading prompt.
        // TODO do we fetch the preview from the API, or use what has already been downloaded (from getTemplates())?
        if (this.settings) {
            if (changes.settings.isFirstChange()) {
                // A basic check to ensure that the settings have actually changed.
                // previousValue and currentValue would always be different as they're different objects.
                const old_template: string = changes.settings.previousValue;
                const new_template: string = changes.settings.currentValue;
                if (old_template !== new_template) {
                    this.updatePreview();
                }
            }
        }
    }

    /**
     *
     */
    updatePreview() {
        if (!this._loading) {
            this._loading = true;
            this.NotifyAPI.getTemplatePreview(this.settings.template_id, this.settings.version)
                .subscribe(preview => {
                    this.preview = preview;
                    this.placeholders = {};
                    this._loading = false;
                });
        }
    }

    /**
     *
     */
    getPlaceholders(): string[] {
        // const regex = new RegExp('\(\(([A-za-z0-9 ]+)\)\)', 'gm');
        const regex = new RegExp('\(\(Free Type\)\)', 'gm');
        // At present we're only looking for a "((Free Type))" placeholder.
        const matches = regex.exec(this.preview);
        let placeholders: string[] = [];
        if (matches) {
            placeholders.push(matches[1]);
        }
        return placeholders;
    }

    /**
     *
     */
    getCustomisedPreview(): string {
        let preview = this.preview;
        if (this.placeholders) {
            // Replace any placeholders in the template with our custom values.
            const values: { placeholder: string, value: string }[] = Object.keys(this.placeholders)
                .map((key) => { return { placeholder: `((${key}))`, value: this.placeholders[key] }; })
                .filter((v: any) => v.value);
            values.forEach((v) => {
                preview = preview.replace(v.placeholder, `<span class="preview__highlight">${v.value}</span>`);
            });
        }
        return preview;
    }

}
