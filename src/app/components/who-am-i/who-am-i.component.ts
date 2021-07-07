import {Component, OnInit} from '@angular/core';
import {AccountService} from '../../services/account.service';

@Component({
  selector: 'app-who-am-i',
  templateUrl: './who-am-i.component.html',
  styleUrls: ['./who-am-i.component.scss']
})
export class WhoAmIComponent implements OnInit {
  constructor(public service: AccountService) {
  }

  ngOnInit(): void {
  }
}
