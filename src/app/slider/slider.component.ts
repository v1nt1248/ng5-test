import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

export interface SliderParams {
  begin: number;
  end: number;
  from: number;
  to: number;
  constraints: [{from: number, to: number}];
}

const BODY_HEIGHT = 8;
const POINT_SIZE = 16;

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {
  @Input() params: SliderParams;
  @Output() changed = new EventEmitter<{from: number, to: number}>();

  @ViewChild('sliderBody')
  sliderBody: ElementRef;
  @ViewChild('pointLeft')
  pontLeft: ElementRef;
  @ViewChild('pointRight')
  pontRight: ElementRef;

  private state: {
    from: number;
    to: number;
  };
  private points: {
    left: number;
    leftStartState: number;
    leftStyles: {[key: string]: string};
    right: number;
    rightStartState: number;
    rightStyles: {[key: string]: string};
  };
  private unitSize: number;

  constructor() { }

  ngOnInit() {
    this.state = {
      from: this.params.from,
      to: this.params.to
    };
    this.points = {
      left: null,
      leftStartState: this.params.from,
      leftStyles: this.getPointStyles('left'),
      right: null,
      rightStartState: this.params.to,
      rightStyles: this.getPointStyles('right')
    };
    this.unitSize = this.sliderBody.nativeElement.getBoundingClientRect().width / (this.params.end - this.params.begin);
  }

  transformStateToPosition(state: number, part: 'left'|'right'|'center'): number {
    const sliderBodyElem = this.sliderBody.nativeElement.getBoundingClientRect();
    if (state <= this.params.begin) {
      return (part === 'center') ? 0 : -POINT_SIZE / 2;
    }
    if (state >= this.params.end) {
      return (part === 'center') ? sliderBodyElem.width : sliderBodyElem.width - POINT_SIZE / 2;
    }
    const pos = Math.round((state - this.params.begin) / (this.params.end - this.params.begin) * sliderBodyElem.width - (part !== 'center' ? POINT_SIZE / 2 : 0));

    // console.log(`P: ${part} | St: ${state} | STATES: ${JSON.stringify(this.state)}`);
    return pos;
  }

  getSliderBodyStyles(): {[key: string]: string} {
    return {height: `${BODY_HEIGHT}px`};
  }

  getPointStyles(field: 'left'|'right'): {[key: string]: string} {
    const who = field === 'left' ? 'from' : 'to';
    const leftPosition = this.transformStateToPosition(this.state[who], field);
    const styles = {
      left: `${leftPosition}px`,
      top: `${(BODY_HEIGHT - POINT_SIZE) / 2}px`,
      width: `${POINT_SIZE}px`,
      height: `${POINT_SIZE}px`
    };
    return styles;
  }

  blockedIntervalStyle(block: {from: number, to: number}): {[key: string]: string} {
    const left = {
      from: this.transformStateToPosition(block.from, 'center'),
      to: this.transformStateToPosition(block.to, 'center')
    };
    return {
      left: `${left.from}px`,
      width: `${left.to - left.from}px`
    };
  }

  onMouseDown(ev: MouseEvent, field: 'left'|'right'): void {
    this.points[field] = ev.clientX;
    // console.log(`field: ${field} | posDown: ${this.points[field]}`);
  }

  onMouseUp(): void {
    this.points.left = null;
    this.points.right = null;
    this.points.leftStartState = this.state.from;
    this.points.rightStartState = this.state.to;
  }

  onMouseOut(ev: MouseEvent): void {
    const button = ev.which;
    if (button !== 1) {
      this.onMouseUp();
    }
  }

  onMouseMove(ev: MouseEvent): void {
    const field = this.points.left ? 'left' : (this.points.right ? 'right' : null);
    if (field) {
      let diff = 0;
      switch (field) {
        case 'left':
          diff = ev.clientX - this.points.left;
          const incStateFrom = Math.round(diff / this.unitSize);
          const newStateFrom = this.points.leftStartState + incStateFrom;
          if (newStateFrom >= this.params.begin && newStateFrom < this.state.to && this.state.from !== newStateFrom) {
            this.state.from = newStateFrom;
            this.points.leftStyles = this.getPointStyles('left');
          }
          break;
        case 'right':
          diff = ev.clientX - this.points.right;
          const incStateTo = Math.round(diff / this.unitSize);
          const newStateTo = this.points.rightStartState + incStateTo;
          if (newStateTo > this.state.from && newStateTo <= this.params.end && this.state.to !== newStateTo) {
            this.state.to = newStateTo;
            this.points.rightStyles = this.getPointStyles('right');
          }
      }
    }
  }

}
