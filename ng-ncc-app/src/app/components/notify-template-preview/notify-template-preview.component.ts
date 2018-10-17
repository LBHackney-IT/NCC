import { Component, EventEmitter, Input, Output, OnChanges, OnInit, OnDestroy, SimpleChange } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { NotifyAPIService } from '../../API/NotifyAPI/notify-api.service';
import { ITemplatePreviewSettings } from '../../interfaces/template-preview-settings';

@Component({
    selector: 'app-notify-template-preview',
    templateUrl: './notify-template-preview.component.html',
    styleUrls: ['./notify-template-preview.component.scss']
})
export class NotifyTemplatePreviewComponent implements OnInit, OnChanges, OnDestroy {
    @Input() settings: ITemplatePreviewSettings;
    @Output() settingsChange = new EventEmitter<ITemplatePreviewSettings>();

    private _destroyed$ = new Subject();

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
            // A basic check to ensure that the settings have actually changed.
            // previousValue and currentValue would always be different as they're different objects.
            const old_template: string = changes.settings.previousValue;
            const new_template: string = changes.settings.currentValue;
            if (old_template !== new_template) {
                this.updatePreview();
            }

            this.settingsChange.emit(this.settings);
        }
    }

    /**
     *
     */
    ngOnDestroy() {
        this._destroyed$.next();
    }

    /**
     *
     */
    trackByMethod(index: number, item: string): number {
        return index;
    }

    /**
     * Sanitise the label used for customisation fields.
     * This was added for the benefit of fields such as "2Free Type" as defined on GOV.UK Notify.
     */
    sanitiseLabel(label: string): string {
        const result = label.match(/^[0-9]*(.*)/); // Does the label begin with a number?
        if (result.length) {
            return result[1];
        }
        return label;
    }

    /**
     *
     */
    updatePreview() {
        if (!this._loading) {
            this._loading = true;
            this.NotifyAPI.getTemplatePreview(this.settings.template_id, this.settings.version)
                .pipe(
                    takeUntil(this._destroyed$)
                )
                .subscribe(preview => {
                    this.preview = preview;
                    this.settings.parameters = {};
                    this._loading = false;
                });
        }
    }

    /**
     * Returns a list of labels representing placeholders.
     */
    getPlaceholders(): string[] {
        // const regex = new RegExp('\(\(([A-za-z0-9 ]+)\)\)', 'gm');
        const regex = /\(\(([A-za-z0-9 ]+)\)\)/gm;
        const matches = regex.exec(this.preview);
        let placeholders: string[];
        placeholders = [];
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
        if (this.settings && this.settings.parameters) {
            // Replace any placeholders in the template with our custom values.
            const values: { placeholder: string, value: string }[] = Object.keys(this.settings.parameters)
                .map((key) => ({ placeholder: `((${key}))`, value: this.settings.parameters[key] }))
                .filter((v: any) => v.value);
            values.forEach((v) => {
                preview = preview.replace(v.placeholder, `<span class="preview__highlight">${v.value}</span>`);
            });
        }

        // Replace line breaks in the template with BR tags.
        preview = preview.replace(/\n/g, '<br>');

        return preview;
    }

}
