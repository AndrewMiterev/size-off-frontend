import {Component, OnInit} from '@angular/core';
import {AccountService} from '../../services/account.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private service: AccountService, private router: Router) {
  }

  // http://localhost:4200/callback
  // https://wwwd.fbc.co.il/sizeoff/callback

  ngOnInit(): void {
    if (this.service.isLogged()) {
      if (this.service.user.isAdmin()) {
        this.router.navigate(['/users']);
        return;
      }
      if (this.service.user.isUser() || this.service.user.isObserver()) {
        this.router.navigate(['/servers']);
        return;
      }
      this.router.navigate(['/who-am-i']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
