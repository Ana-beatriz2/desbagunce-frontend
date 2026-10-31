import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  CreateItemRequest,
  ItemUnit,
  MAX_ESTIMATED_DURATION_DAYS,
  MAX_ITEM_QUANTITY,
  MAX_ITEM_QUANTITY_DECIMALS,
  unitLabel,
} from '../../../core/models/item.model';
import { ItemService } from '../../../core/services/item.service';
import { UserService } from '../../../core/services/user.service';
import { PrimaryNavComponent } from '../../../shared/components/primary-nav/primary-nav.component';

const UNIT_OPTIONS: { value: ItemUnit; label: string }[] = [
  { value: 'unit', label: 'Unidade' },
  { value: 'kg', label: 'Quilo (kg)' },
];

const OFFLINE_ERROR = 'Não foi possível falar com o servidor. Verifique sua conexão e tente novamente.';
const INVALID_DATA_ERROR = 'Confira os dados do item e tente novamente.';
const SESSION_ERROR = 'Sua sessão expirou. Entre novamente para continuar.';
const FORBIDDEN_ERROR = 'Você não tem acesso a esta casa.';
const HOUSE_NOT_FOUND_ERROR = 'Não encontramos a sua casa. Atualize a página e tente novamente.';
const GENERIC_ERROR = 'Não foi possível salvar o item. Tente novamente em instantes.';
const MISSING_HOUSE_ERROR = 'Ainda estamos carregando a sua casa. Aguarde um instante e tente de novo.';

function isWholeNumberWhenCountedInUnits(control: AbstractControl): ValidationErrors | null {
  const unit = control.parent?.get('unit')?.value as ItemUnit | undefined;
  if (unit !== 'unit' || control.value === null || control.value === '') return null;
  return Number.isInteger(control.value) ? null : { wholeNumber: true };
}

function isInteger(control: AbstractControl): ValidationErrors | null {
  if (control.value === null || control.value === '') return null;
  return Number.isInteger(control.value) ? null : { integer: true };
}

function maxDecimals(max: number): ValidatorFn {
  return (control) => {
    if (control.value === null || control.value === '') return null;
    const decimals = String(control.value).split('.')[1]?.length ?? 0;
    return decimals <= max ? null : { maxDecimals: true };
  };
}

@Component({
  selector: 'app-new-item',
  imports: [ReactiveFormsModule, RouterLink, MatButtonModule, MatIconModule, PrimaryNavComponent],
  templateUrl: './new-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewItemComponent {
  private fb = inject(FormBuilder);
  private itemService = inject(ItemService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  session = inject(UserService).currentSession;
  unitOptions = UNIT_OPTIONS;
  maxDurationDays = MAX_ESTIMATED_DURATION_DAYS;

  submitting = signal(false);
  errorMessage = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    unit: ['unit' as ItemUnit, [Validators.required]],
    currentQuantity: [
      null as number | null,
      [
        Validators.required,
        Validators.min(0),
        Validators.max(MAX_ITEM_QUANTITY),
        maxDecimals(MAX_ITEM_QUANTITY_DECIMALS),
        isWholeNumberWhenCountedInUnits,
      ],
    ],
    estimatedDurationDays: [
      null as number | null,
      [Validators.required, isInteger, Validators.min(1), Validators.max(MAX_ESTIMATED_DURATION_DAYS)],
    ],
    notes: [''],
  });

  selectedUnit = signal<ItemUnit>('unit');
  quantitySuffix = computed(() => unitLabel(this.selectedUnit()));
  quantityStep = computed(() => (this.selectedUnit() === 'kg' ? 0.001 : 1));

  constructor() {
    this.session.load();
  }

  selectUnit(unit: ItemUnit): void {
    this.form.controls.unit.setValue(unit);
    this.selectedUnit.set(unit);
    this.form.controls.currentQuantity.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const houseId = this.session.value()?.user.houseId;
    if (!houseId) {
      this.errorMessage.set(MISSING_HOUSE_ERROR);
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);

    this.itemService
      .createItem(houseId, this.buildPayload())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.router.navigate(['/items']),
        error: (err: HttpErrorResponse) => {
          this.submitting.set(false);
          this.errorMessage.set(this.mapError(err.status));
        },
      });
  }

  chipClass(selected: boolean): string {
    return selected ? 'border-primary bg-primary text-white' : 'border-border bg-surface text-ink';
  }

  private buildPayload(): CreateItemRequest {
    const { name, unit, currentQuantity, estimatedDurationDays, notes } = this.form.getRawValue();
    const trimmedNotes = notes.trim();

    return {
      name: name.trim(),
      unit,
      currentQuantity: currentQuantity as number,
      estimatedDurationDays: estimatedDurationDays as number,
      ...(trimmedNotes ? { notes: trimmedNotes } : {}),
    };
  }

  private mapError(status: number): string {
    switch (status) {
      case 0:
        return OFFLINE_ERROR;
      case 400:
        return INVALID_DATA_ERROR;
      case 401:
        return SESSION_ERROR;
      case 403:
        return FORBIDDEN_ERROR;
      case 404:
        return HOUSE_NOT_FOUND_ERROR;
      default:
        return GENERIC_ERROR;
    }
  }
}
