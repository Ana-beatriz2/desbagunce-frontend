import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastComponent, ToastData } from '../../shared/components/toast/toast.component';

const SUCCESS_DURATION_MS = 4000;

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private snackBar = inject(MatSnackBar);

  success(message: string): void {
    this.snackBar.openFromComponent<ToastComponent, ToastData>(ToastComponent, {
      data: { message },
      duration: SUCCESS_DURATION_MS,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: 'app-toast-panel',
    });
  }
}
