import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { finalize, take, takeUntil } from 'rxjs/operators';

import { NCCAPIService } from '../../../common/API/NCCAPI/ncc-api.service';
import { AuthService } from '../../../common/services/auth.service';

@Component({
    selector: 'app-editorial',
    templateUrl: './editorial.component.html',
    styleUrls: ['./editorial.component.scss']
})
export class EditorialComponent implements OnInit, OnDestroy {

    editing: boolean;
    saving: boolean;
    error: boolean;
    content: string;
    new_content: string;

    private _destroyed$ = new Subject();

    /**
     *
     */
    constructor(private NCCAPI: NCCAPIService, private Auth: AuthService) { }

    /**
     *
     */
    ngOnInit() {
        this.NCCAPI.getEditorial()
            .pipe(takeUntil(this._destroyed$))
            .subscribe((content: string) => {
                this.content = content;
            });
    }

    /**
     *
     */
    ngOnDestroy() {
        this._destroyed$.next();
    }

    /**
     * Returns TRUE if the editorial text can be edited.
     */
    canEdit(): boolean {
        return this.Auth.isTeamLeader();
    }

    /**
     * Enables the form for editing the editorial text.
     */
    beginEdit() {
        if (this.canEdit()) {
            this.new_content = this.content;
            this.editing = true;
        }
    }

    /**
     * Saves updated editorial text.
     */
    saveText() {
        if (this.saving || !this.canEdit()) {
            return;
        }

        this.error = false;
        this.saving = true;

        this.NCCAPI.setEditorial(this.new_content)
            .pipe(take(1))
            .pipe(finalize(() => {
                this.saving = false;
            }))
            .subscribe(
                () => {
                    // successful update.
                    this.content = this.new_content;
                    this.resetText();
                },
                (error) => {
                    this.error = true;
                }
            );
    }

    /**
     * Resets the editorial text form.
     */
    resetText() {
        this.new_content = null;
        this.editing = false;
    }

}
