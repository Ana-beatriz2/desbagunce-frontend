import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { SignupStateService } from '../../core/services/signup-state.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, MatButtonModule],
  templateUrl: './register.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private signupState = inject(SignupStateService);

  private savedState = this.signupState.snapshot();

  form = this.fb.nonNullable.group({
    name: [this.savedState.name, [Validators.required, Validators.minLength(3)]],
    email: [this.savedState.email, [Validators.required, Validators.email]],
    password: [this.savedState.password, [Validators.required, Validators.minLength(8)]],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.signupState.patch(this.form.getRawValue());
    this.router.navigate(['/create-house']);
  }
}
