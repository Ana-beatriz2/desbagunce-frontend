import { effect, inject, signal, untracked } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const DEFAULT_CACHE_TTL_MS = 5 * 60_000;

export class CachedResource<T> {
  private readonly state = signal<T | null>(null);
  private readonly errorState = signal(false);
  private fetchedAt = 0;
  private inFlight: Subscription | null = null;

  readonly value = this.state.asReadonly();
  readonly hasError = this.errorState.asReadonly();

  constructor(
    private readonly fetcher: () => Observable<T>,
    private readonly ttlMs = DEFAULT_CACHE_TTL_MS,
  ) {
    const auth = inject(AuthService);
    let previousUid: string | null = null;
    effect(() => {
      const uid = auth.currentUser()?.uid ?? null;
      if (previousUid !== null && uid !== previousUid) {
        untracked(() => this.clear());
      }
      previousUid = uid;
    });
  }

  load(): void {
    const isFresh = this.state() !== null && Date.now() - this.fetchedAt < this.ttlMs;
    if (isFresh || this.isFetching()) return;
    this.refresh();
  }

  refresh(): void {
    this.inFlight?.unsubscribe();
    this.inFlight = this.fetcher().subscribe({
      next: (value) => {
        this.state.set(value);
        this.fetchedAt = Date.now();
        this.errorState.set(false);
      },
      error: () => this.errorState.set(true),
    });
  }

  update(fn: (value: T) => T): void {
    const current = this.state();
    if (current !== null) this.state.set(fn(current));
  }

  clear(): void {
    this.inFlight?.unsubscribe();
    this.inFlight = null;
    this.state.set(null);
    this.errorState.set(false);
    this.fetchedAt = 0;
  }

  private isFetching(): boolean {
    return this.inFlight !== null && !this.inFlight.closed;
  }
}
