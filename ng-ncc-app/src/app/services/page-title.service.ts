import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PageTitleService {

    constructor(private t: Title) { }

    set(new_title: string) {
        this.t.setTitle(`${new_title} - ${environment.appName}`);
    }

}
