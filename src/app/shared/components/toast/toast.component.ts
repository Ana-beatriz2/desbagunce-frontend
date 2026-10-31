import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

export interface ToastData {
  message: string;
}

@Component({
  selector: 'app-toast',
  imports: [MatIconModule],
  templateUrl: './toast.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent {
  private snackBarRef = inject(MatSnackBarRef);

  data = inject<ToastData>(MAT_SNACK_BAR_DATA);

  dismiss(): void {
    this.snackBarRef.dismiss();
  }
}
