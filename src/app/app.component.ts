import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  params = {
    begin: 0,
    end: 100,
    from: 0,
    to: 100,
    constraints: [{from: 30, to: 40}]
  };
}
