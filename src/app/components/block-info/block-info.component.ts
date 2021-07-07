import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-block-info',
  templateUrl: './block-info.component.html',
  styleUrls: ['./block-info.component.scss']
})
export class BlockInfoComponent {
  panelOpenState = false;
  @Input()
  title: string;
  @Input()
  description: string;
  @Input()
  name: string;

  constructor() {
  }
}
