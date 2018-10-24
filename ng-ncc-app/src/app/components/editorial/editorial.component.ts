import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { NCCAPIService } from '../../API/NCCAPI/ncc-api.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-editorial',
    templateUrl: './editorial.component.html',
    styleUrls: ['./editorial.component.scss']
})
export class EditorialComponent implements OnInit, OnDestroy {

    editing: boolean;
    saving: boolean;
    content: string;
    new_content: string;

    private _destroyed$ = new Subject();

    constructor(private NCCAPI: NCCAPIService, private Auth: AuthService) { }

    /**
     *
     */
    ngOnInit() {
        this.NCCAPI.getEditorial()
            .pipe(
                takeUntil(this._destroyed$)
            )
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
     *
     */
    canEdit(): boolean {
        return this.Auth.isTeamLeader();
    }

    /**
     *
     */
    beginEdit() {
        if (this.canEdit()) {
            this.new_content = this.content;
            this.editing = true;
        }
    }

    /**
     *
     */
    saveText() {
        if (this.saving || !this.canEdit()) {
            return;
        }

        this.saving = true;

        const subscription = this.NCCAPI.setEditorial(this.new_content)
            .subscribe(
                () => {
                    console.log('Editorial was updated.');
                    this.content = this.new_content;
                    this.resetText();
                },
                (error) => { console.log(error); },
                () => {
                    this.saving = false;
                    subscription.unsubscribe();
                }
            );
    }

    /**
     *
     */
    resetText() {
        this.new_content = null;
        this.editing = false;
    }

}
