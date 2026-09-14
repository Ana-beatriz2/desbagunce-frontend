import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SignupStateService } from '../../core/services/signup-state.service';
import { UserService } from '../../core/services/user.service';

const GENERIC_SIGNUP_ERROR = 'Não foi possível criar a sua conta. Tente novamente em instantes.';
const SIGNUP_CONFLICT_ERROR = 'Não foi possível concluir o cadastro com os dados informados.';

@Component({
  selector: 'app-create-house',
  imports: [ReactiveFormsModule, RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './create-house.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateHouseComponent {
  private fb = inject(FormBuilder);
  private signupState = inject(SignupStateService);
  private userService = inject(UserService);
  private destroyRef = inject(DestroyRef);

  private savedState = this.signupState.snapshot();

  fileInput = viewChild.required<ElementRef<HTMLInputElement>>('fileInput');
  photoPreview = signal<string | null>(this.savedState.housePhoto);

  submitting = signal(false);
  errorMessage = signal<string | null>(null);
  success = signal(false);

  form = this.fb.nonNullable.group({
    name: [this.savedState.houseName, [Validators.required, Validators.minLength(2)]],
  });

  constructor() {
    this.form.controls.name.valueChanges.pipe(takeUntilDestroyed()).subscribe((houseName) => {
      this.signupState.patch({ houseName });
    });
  }

  openFilePicker(): void {
    this.fileInput().nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      this.photoPreview.set(dataUrl);
      this.signupState.patch({ housePhoto: dataUrl });
    };
    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, email, password } = this.signupState.snapshot();
    const houseName = this.form.controls.name.value;

    this.submitting.set(true);
    this.errorMessage.set(null);

    this.userService
      .createAdmin({ name, email, password, house: { name: houseName } })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.success.set(true);
        },
        error: (err: HttpErrorResponse) => {
          this.submitting.set(false);
          const message = err.status === 409 ? SIGNUP_CONFLICT_ERROR : GENERIC_SIGNUP_ERROR;
          this.errorMessage.set(message);
        },
      });
  }
}
