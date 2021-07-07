import {Component, OnInit} from '@angular/core';
import {AccountService} from '../../services/account.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-logoff',
  templateUrl: './logoff.component.html',
  styleUrls: ['./logoff.component.scss']
})
export class LogoffComponent implements OnInit {
  constructor(private accountService: AccountService, private router: Router) {
  }

  ngOnInit(): void {
    this.accountService.logout();
    this.router.navigate(['/login']);
  }
}
