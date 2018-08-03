// APP component.
// <app-root></app-root>

import { Component, OnInit } from '@angular/core';
import { initAll } from 'govuk-frontend';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'ng-ncc-app';

  ngOnInit() {
      initAll(); // initialise GOV.UK Frontend components.
  }

}
