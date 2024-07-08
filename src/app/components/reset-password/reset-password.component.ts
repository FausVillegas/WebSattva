import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  token: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {
    // this.resetPasswordForm = this.fb.group({
    //   newPassword: ['', [Validators.required, Validators.minLength(6)]],
    //   confirmPassword: ['', [Validators.required]]
    // }, { validator: this.passwordsMatchValidator });
    
    this.resetPasswordForm = new FormGroup({
      newPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required])
    }, { validators: this.passwordsMatchValidator });

    this.token = '';
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams['token'];
  }

  passwordsMatchValidator: ValidatorFn = (form: AbstractControl): { [key: string]: boolean } | null => {
    const password = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  };

  onSubmit(): void {
    if (this.resetPasswordForm.valid) {
      this.authService.resetPassword(this.token, this.resetPasswordForm.value.newPassword)
        .subscribe(response => {
          console.log('Password reset: ', response);
          this.router.navigate(['/login']);
        });
    } else {
      console.log('Form is invalid');
    }
  }
}
