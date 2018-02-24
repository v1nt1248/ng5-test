import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private params = {
    begin: 20, // начало диапазона Slider
    end: 200, // конец диапазона Slider
    from: 100, // начальное значение начала выбранного диапазона
    to: 150, // начальное значение окончания выбранного диапазона
    constraints: [{from: 50, to: 80}, {from: 160, to: 180}]
  };
  private interval = {
    from: null,
    to: null
  };

  onChange(value: {from: number, to: number}): void {
    if (JSON.stringify(this.interval) !== JSON.stringify(value)) {
      this.interval = Object.assign({}, value);
      console.log(`Выбран диапазон от ${value.from} до ${value.to}`);
    }
  }
}
