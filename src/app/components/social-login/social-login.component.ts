import {Component, OnInit} from '@angular/core';
import {SocialService} from '../../services/social.service';

@Component({
  selector: 'app-social-login',
  templateUrl: './social-login.component.html',
  styleUrls: ['./social-login.component.scss']
})
export class SocialLoginComponent implements OnInit {
  constructor(private socialService: SocialService) {
  }

  ngOnInit(): void {
  }

  login(provider: string): void {
    console.log(provider);
    this.socialService.login(provider);
  }
}
