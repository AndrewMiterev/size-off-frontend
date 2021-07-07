import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AccountService} from '../../services/account.service';
import {AlertService} from '../../services/alert.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  loading = false;
  showPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService
  ) {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.minLength(5),
        Validators.maxLength(80), Validators.pattern(/.+@.+\..+/)]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  get f(): { [p: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit(): void {
    this.alertService.clear();
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    this.accountService.login(this.f.email.value, this.f.password.value)
      .subscribe({
        next: () => this.router.navigate(['/home']),
        error: () => this.loading = false,
        complete: () => this.loading = false
      });
  }
}
