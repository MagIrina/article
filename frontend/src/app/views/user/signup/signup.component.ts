import { Component, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;
  showPassword = false;
  submitting = false;

  private namePattern = /^[А-ЯЁ][а-яё]+(?:\s[А-ЯЁ][а-яё]+)*$/;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    @Optional() private _snackBar?: MatSnackBar
  ) {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(this.namePattern)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/)
      ]],
      agree: [false, [Validators.requiredTrue]]
    });
  }

  ngOnInit(): void {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  private notify(message: string): void {
    if (this._snackBar) {
      this._snackBar.open(message, 'OK', { duration: 3000 });
      return;
    }
    alert(message);
  }

  submit(): void {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    const { name, email, password } = this.signupForm.value;
    this.submitting = true;

    this.authService.signup(name, email, password).subscribe({
      next: () => {
        this.notify('Регистрация прошла успешно');
        this.router.navigate(['/']);
        this.submitting = false;
      },
      error: (err: HttpErrorResponse) => {
        this.notify(err?.error?.message || 'Ошибка регистрации');
        this.submitting = false;
      }
    });
  }

  get name() { return this.signupForm.get('name'); }
  get email() { return this.signupForm.get('email'); }
  get password() { return this.signupForm.get('password'); }
  get agree() { return this.signupForm.get('agree'); }
}


