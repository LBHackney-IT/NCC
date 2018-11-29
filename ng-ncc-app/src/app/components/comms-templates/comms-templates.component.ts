import { environment } from '../../../environments/environment';
import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CONTACT } from '../../constants/contact.constant';
import { CommsOption } from '../../classes/comms-option.class';
import { NotifyAPIService } from '../../API/NotifyAPI/notify-api.service';

@Component({
    selector: 'app-comms-templates',
    templateUrl: './comms-templates.component.html',
    styleUrls: ['./comms-templates.component.scss']
})
export class CommsTemplatesComponent implements OnInit, OnDestroy {
    @Input() title?: string;
    @Input() includeSensitive?: boolean;

    @Output() selected = new EventEmitter<CommsOption>();
    @Output() error = new EventEmitter<void>();

    private _destroyed$ = new Subject();

    _loading = false;
    _options: CommsOption[];
    _selected: CommsOption = null;
    default_title = 'Select form to send:';
    exclude = environment.disable.commsTemplates;

    constructor(private NotifyAPI: NotifyAPIService) { }

    ngOnInit() {
        // Fetch a list of available templates from the Notify API.
        this._loading = true;
        this.NotifyAPI.getAllTemplates()
            .pipe(
                takeUntil(this._destroyed$)
            )
            .subscribe(
                (data) => {
                    this._options = this._filterTemplates(data);
                    this._loading = false;

                    this.reset();
                },
                (error) => {
                    this.error.emit();
                }
            );
    }

    ngOnDestroy() {
        this._destroyed$.next();
    }

    reset() {
        // If there's only one template, select it.
        if (1 === this._options.length) {
            this._selected = this._options[0];
        } else {
            this._selected = null;
        }
        this.selectedTemplate();
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

        // Filter out excluded templates (defined above).
        const excluded = this.exclude;
        options = options.filter((option: CommsOption) => {
            const match_email = option.templates[CONTACT.METHOD_EMAIL] &&
                -1 !== excluded.indexOf(option.templates[CONTACT.METHOD_EMAIL].id);
            const match_sms = option.templates[CONTACT.METHOD_SMS] && -1 !== excluded.indexOf(option.templates[CONTACT.METHOD_SMS].id);
            const match_post = option.templates[CONTACT.METHOD_POST] && -1 !== excluded.indexOf(option.templates[CONTACT.METHOD_POST].id);

            return !(match_email || match_sms || match_post);
        });

        // Filter out receipt templates.
        options = options.filter((option: CommsOption) => !option.isReceipt());

        return options;
    }

    /**
     * Called when a communications option is selected.
     */
    selectedTemplate() {
        this.selected.emit(this._selected);
    }

    /**
     * A crude method of disabling certain comms methods.
     */
    matchesExcluded(option: CommsOption): boolean {
        switch (option.displayName.toLowerCase()) {
            case 'right to buy':
            case 'standing order (major works)':
            case 'standing order (service charge)':
                return true;
        }

        return false;
    }

}
