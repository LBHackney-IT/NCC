import { Component, OnInit } from '@angular/core';

import { CallRevisionService } from '../../services/call-revision.service';

@Component({
    selector: 'app-add-notes',
    templateUrl: './add-notes.component.html',
    styleUrls: ['./add-notes.component.scss']
})
export class PageAddNotesComponent implements OnInit {

    // This page is similar to the View Notes page, except it doesn't have a dependency on the Call service.
    constructor(private CallRevision: CallRevisionService) { }

    ngOnInit() { }

}
