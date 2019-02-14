import { Injectable, OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ViewOnlyService implements OnInit {

    private _status = false;
    private _subject$ = new ReplaySubject<boolean>();

    ngOnInit() {
        this._update();
    }

    /**
     *
     */
    get status(): boolean {
        return this._status;
    }

    /**
     *
     */
    set status(status: boolean) {
        this._status = status;
        this._update();
    }

    /**
     *
     */
    private _update() {
        this._subject$.next(this._status);
    }

    /**
     *
     */
    public updates(): ReplaySubject<boolean> {
        return this._subject$;
    }

}
