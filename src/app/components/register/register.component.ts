import {Component, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  ValidationErrors,
  Validators
} from '@angular/forms';
import {AccountService} from '../../services/account.service';
import {AlertService} from '../../services/alert.service';
import {Router} from '@angular/router';
import {ErrorStateMatcher} from '@angular/material/core';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  loading = false;

  emailFormControl = new FormControl('', [Validators.required, Validators.email, Validators.minLength(6),
    Validators.maxLength(80), Validators.pattern(/.+@.+\..+/)]);
  nameFormControl = new FormControl('', [Validators.required, Validators.minLength(5),
    Validators.maxLength(80), Validators.pattern(/..+ ..+/)]);
  passwordFormControl = new FormControl('', [Validators.required, Validators.minLength(8),
    Validators.maxLength(80)]);
  confirmFormControl = new FormControl('', [Validators.required]);
  commonControl = new FormGroup({
    email: this.emailFormControl,
    name: this.nameFormControl,
    password: this.passwordFormControl,
    confirm: this.confirmFormControl
  }, {
    validators: this.mismatchPassword
  });
  matcher = new MyErrorStateMatcher();
  showPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private alertService: AlertService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
  }

  mismatchPassword(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password').value;
    const confirm = control.get('confirm').value;
    if (password !== confirm) {
      const error = {mismatchPassword: true};
      control.get('confirm').setErrors(error);
      return error;
    }
    return null;
  }

  onSubmit(): void {
    this.alertService.clear();
    this.loading = true;
    this.accountService.register(this.emailFormControl.value, this.nameFormControl.value, this.passwordFormControl.value)
      .subscribe({
        next: () => {
          this.alertService.success('Registration successful. Please call to FBC administrators for take necessary permissions',
            {keepAfterRouteChange: true});
          this.router.navigate(['../login']);
        },
        error: () => this.loading = false,
        complete: () => this.loading = false
      });
  }
}
