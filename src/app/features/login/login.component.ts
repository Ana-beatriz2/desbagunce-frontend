import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FirebaseError } from 'firebase/app';
import { AuthService } from '../../core/services/auth.service';

const INVALID_CREDENTIALS_ERROR = 'E-mail ou senha incorretos.';
const TOO_MANY_REQUESTS_ERROR = 'Muitas tentativas. Tente novamente em alguns minutos.';
const GENERIC_LOGIN_ERROR = 'Não foi possível entrar. Tente novamente em instantes.';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, MatButtonModule],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  submitting = signal(false);
  errorMessage = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.getRawValue();

    this.submitting.set(true);
    this.errorMessage.set(null);

    this.authService
      .login(email, password)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/home');
        },
        error: (err: FirebaseError) => {
          this.submitting.set(false);
          this.errorMessage.set(this.mapError(err.code));
        },
      });
  }

  private mapError(code: string): string {
    switch (code) {
      case 'auth/invalid-credential':
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return INVALID_CREDENTIALS_ERROR;
      case 'auth/too-many-requests':
        return TOO_MANY_REQUESTS_ERROR;
      default:
        return GENERIC_LOGIN_ERROR;
    }
  }
}
