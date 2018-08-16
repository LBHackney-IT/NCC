import { Component, Input, OnChanges, OnInit, SimpleChange } from '@angular/core';
import { NotifyAPIService } from '../../API/NotifyAPI/notify-api.service';
import { TemplatePreviewSettings } from '../../classes/template-preview-settings.class';

@Component({
    selector: 'app-notify-template-preview',
    templateUrl: './notify-template-preview.component.html',
    styleUrls: ['./notify-template-preview.component.css']
})
export class NotifyTemplatePreviewComponent implements OnInit, OnChanges {
    @Input() settings: TemplatePreviewSettings;

    _loading: boolean;
    preview: string;

    constructor(private NotifyAPI: NotifyAPIService) { }

    ngOnInit() {
        this._loading = false;
        this.preview = 'testing';
    }

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        // TODO display a loading prompt.
        // TODO do we fetch the preview from the API, or use what has already been downloaded (from getTemplates())?
        if (this.settings) {
            if (changes.settings.isFirstChange() || changes.settings.previousValue.template_id !== changes.settings.currentValue.template_id) {
                // A basic check to ensure that the settings have actually changed.
                // previousValue and currentValue would always be different as they're different objects.
                this.updatePreview();
            }
        }
    }

    updatePreview() {
        if (!this._loading) {
            this._loading = true;
            this.NotifyAPI.getTemplatePreview(this.settings.template_id, this.settings.version)
                .subscribe(preview => {
                    this.preview = preview;
                    this._loading = false;
                });
        }
    }

}
