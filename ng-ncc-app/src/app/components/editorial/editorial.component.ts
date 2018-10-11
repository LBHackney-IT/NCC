import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-editorial',
    templateUrl: './editorial.component.html',
    styleUrls: ['./editorial.component.scss']
})
export class EditorialComponent implements OnInit {

    editing: boolean;
    content: string;
    new_content: string;

    constructor() { }

    ngOnInit() {
        this.content = 'This is some "editorial" text.';
    }

    beginEdit() {
        this.new_content = this.content;
        this.editing = true;
    }

    saveText() {
        this.content = this.new_content;
        this.resetText();
    }

    resetText() {
        this.new_content = null;
        this.editing = false;
    }

}
