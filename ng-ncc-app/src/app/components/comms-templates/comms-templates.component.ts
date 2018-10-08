import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

import { CommsOption } from '../../classes/comms-option.class';
import { NotifyAPIService } from '../../API/NotifyAPI/notify-api.service';

@Component({
    selector: 'app-comms-templates',
    templateUrl: './comms-templates.component.html',
    styleUrls: ['./comms-templates.component.scss']
})
export class CommsTemplatesComponent implements OnInit {
    @Input() title?: string;
    @Input() includeSensitive?: boolean;

    @Output() selected = new EventEmitter<CommsOption>();

    _loading = false;
    _options: CommsOption[];
    _selected: CommsOption = null;
    default_title = 'Select form to send:';

    constructor(private NotifyAPI: NotifyAPIService) { }

    ngOnInit() {
        // Fetch a list of available templates from the Notify API.
        this._loading = true;
        this.NotifyAPI.getAllTemplates().subscribe(
            (data) => {
                this._options = this._filterTemplates(data);
                this._loading = false;
            }
        );
    }

    trackByMethod(index: number, item: CommsOption): number {
        return index;
    }

    /**
     * Performs filtering on a list of communications options.
     */
    _filterTemplates(options: CommsOption[]): CommsOption[] {
        // By default, sensitive options are not included.
        if (!this.includeSensitive) {
            // Filter out sensitive options.
            options = options.filter((option: CommsOption) => !option.isSensitive());
        }

        return options;
    }

    /**
     * Called when a communications option is selected.
     */
    selectedTemplate() {
        this.selected.emit(this._selected);
    }

}
