import {Component, Input, OnInit} from '@angular/core';
import {Player} from '../models/Player';

@Component({
  selector: 'app-dkp-history',
  templateUrl: './dkp-history.component.html',
  styleUrls: ['./dkp-history.component.scss'],
})
export class DkpHistoryComponent implements OnInit {

  constructor() { }

 @Input() player: Player;

  ngOnInit() {}

}
