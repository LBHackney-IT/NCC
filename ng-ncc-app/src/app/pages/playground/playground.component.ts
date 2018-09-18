import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-playground',
    templateUrl: './playground.component.html',
    styleUrls: ['./playground.component.css']
})
export class PagePlaygroundComponent implements OnInit {

    show: boolean;
    constructor() { }

    ngOnInit() {
        this.show = false;
    }

    openModal() {
        this.show = true;
    }

    handleClose() {
        console.log('Modal was closed.');
    }

    selectedTemplate(option: any) {
        console.log(option.name, option.isSensitive());
    }
}
