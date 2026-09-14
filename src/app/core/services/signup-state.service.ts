import { Injectable, signal } from '@angular/core';

export interface SignupState {
  name: string;
  email: string;
  password: string;
  houseName: string;
  housePhoto: string | null;
}

const INITIAL_STATE: SignupState = {
  name: '',
  email: '',
  password: '',
  houseName: '',
  housePhoto: null,
};

@Injectable({ providedIn: 'root' })
export class SignupStateService {
  private state = signal<SignupState>(INITIAL_STATE);

  readonly snapshot = this.state.asReadonly();

  patch(partial: Partial<SignupState>): void {
    this.state.update((current) => ({ ...current, ...partial }));
  }
}
