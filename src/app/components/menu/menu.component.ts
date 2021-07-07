import {Component, OnInit} from '@angular/core';
import {AccountService} from '../../services/account.service';
import {UserService} from '../../services/user.service';
import {JobService} from '../../services/job.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  constructor(public accountService: AccountService, public userService: UserService,  public jobService: JobService) {
  }

  ngOnInit(): void {
    this.userService.forSubscribe.subscribe();
    this.jobService.forSubscribe.subscribe();
  }
}
