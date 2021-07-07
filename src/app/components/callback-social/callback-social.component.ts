import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SocialService} from '../../services/social.service';
import {MatDialog} from '@angular/material/dialog';
import {DialogOkCancelComponent} from '../dialog-ok-cancel/dialog-ok-cancel.component';
import {AlertService} from '../../services/alert.service';

@Component({
  selector: 'app-callback-social',
  templateUrl: './callback-social.component.html',
  styleUrls: ['./callback-social.component.scss']
})
export class CallbackSocialComponent implements OnInit {
  loading = false;

  constructor(private route: ActivatedRoute, private router: Router,
              private socialService: SocialService,
              public dialog: MatDialog, private alertService: AlertService) {
  }

  ngOnInit(): void {
    this.loading = true;
    this.route.queryParams.subscribe(p => {
      // console.log('catch callback', p);
      this.socialService.fetchToken(p.code, p.state).subscribe({
        next: () => this.router.navigate(['/home']),
        error: (e) => {
          // console.log('Catcheee!', e);
          this.loading = false;
          if (e.status === 401) {
            const name = e.error.name;
            const email = e.error.email;
            const provider = e.error.provider;

            const dialogRef = this.dialog.open(DialogOkCancelComponent, {data: {question: `User <strong>${name}</strong> with email <strong>${email}</strong> does not exist in system. Confirm to create new account and register it as user of service Size-Off?`}});
            dialogRef.afterClosed().subscribe(r => {
              if (r) {
                // console.log('New user', e.error);
                this.socialService.register(provider);
              } else {
                this.router.navigate(['/login']);
              }
            });
          } else {
            if (e.status === 409) {
              this.alertService.error(e.error, {keepAfterRouteChange: true});
            }
            this.router.navigate(['/login']);
          }
        },
        complete: () => this.loading = false
      });
    });
  }
}
