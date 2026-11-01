import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, effect, inject, signal, untracked } from '@angular/core';
import { Observable, delay, map, of, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ATTENTION_STATUSES,
  CreateItemRequest,
  Item,
  ItemQuery,
  ItemResponse,
  ItemStats,
} from '../models/item.model';
import { Page } from '../models/pagination.model';
import { CachedResource } from '../utils/cached-resource';
import { ActivityService } from './activity.service';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

const ATTENTION_PREVIEW_LIMIT = 3;

@Injectable({ providedIn: 'root' })
export class ItemService {
  private http = inject(HttpClient);
  private activityService = inject(ActivityService);
  private userService = inject(UserService);

  private readonly lastResult = signal<{ key: string; page: Page<Item> } | null>(null);

  constructor() {
    const auth = inject(AuthService);
    let previousUid: string | null = null;
    effect(() => {
      const uid = auth.currentUser()?.uid ?? null;
      if (previousUid !== null && uid !== previousUid) {
        untracked(() => this.lastResult.set(null));
      }
      previousUid = uid;
    });
  }

  readonly stats = new CachedResource(() => this.forCurrentHouse((houseId) => this.getStats(houseId)));
  readonly attentionPreview = new CachedResource(() =>
    this.forCurrentHouse((houseId) => this.getAttentionItems(houseId, ATTENTION_PREVIEW_LIMIT)),
  );

  getItems(houseId: string, query: ItemQuery): Observable<Page<Item>> {
    const key = this.queryKey(houseId, query);

    return this.http
      .get<Page<Item>>(`${environment.apiUrl}/houses/${houseId}/items`, {
        params: this.toHttpParams(query),
      })
      .pipe(tap((page) => this.lastResult.set({ key, page })));
  }

  // The item list is component-owned (rxResource), so it dies on navigation. This keeps
  // the last page alive in the service, letting the screen paint it instantly on return
  // while the request revalidates — same idea as CachedResource, but keyed by the query.
  cachedItems(houseId: string, query: ItemQuery): Page<Item> | null {
    const cached = this.lastResult();
    return cached?.key === this.queryKey(houseId, query) ? cached.page : null;
  }

  getAttentionItems(houseId: string, limit = ATTENTION_PREVIEW_LIMIT): Observable<Item[]> {
    return this.getItems(houseId, {
      search: '',
      tagIds: [],
      status: ATTENTION_STATUSES,
      page: 1,
      pageSize: limit,
    }).pipe(map((page) => page.data));
  }

  getStats(houseId: string): Observable<ItemStats> {
    return this.http.get<ItemStats>(`${environment.apiUrl}/houses/${houseId}/items/stats`);
  }

  createItem(houseId: string, payload: CreateItemRequest): Observable<ItemResponse> {
    return this.http
      .post<ItemResponse>(`${environment.apiUrl}/houses/${houseId}/items`, payload)
      .pipe(
        tap(() => {
          // The cached page predates this item, so don't paint it on the way back
          this.lastResult.set(null);
          this.stats.refresh();
          this.attentionPreview.refresh();
          this.activityService.recentActivity.refresh();
        }),
      );
  }

  // TODO(backend): there is no purchase route yet. This resolves without touching the
  // server, so the success toast it triggers does NOT mean anything was recorded.
  markPurchased(itemId: string): Observable<void> {
    return of(undefined)
      .pipe(delay(150))
      .pipe(
        tap(() => {
          this.attentionPreview.update((items) => items.filter((item) => item.id !== itemId));
          this.attentionPreview.refresh();
          this.stats.refresh();
          this.activityService.recentActivity.refresh();
        }),
      );
  }

  private toHttpParams(query: ItemQuery): HttpParams {
    let params = new HttpParams()
      .set('page', query.page)
      .set('pageSize', query.pageSize);

    if (query.search.trim()) {
      params = params.set('search', query.search.trim());
    }
    for (const tagId of query.tagIds) {
      params = params.append('tagIds', tagId);
    }
    for (const status of query.status ?? []) {
      params = params.append('status', status);
    }

    return params;
  }

  private queryKey(houseId: string, query: ItemQuery): string {
    return JSON.stringify([
      houseId,
      query.search.trim(),
      [...query.tagIds].sort(),
      [...(query.status ?? [])].sort(),
      query.page,
      query.pageSize,
    ]);
  }

  private forCurrentHouse<T>(fetch: (houseId: string) => Observable<T>): Observable<T> {
    const houseId = this.userService.houseId();
    if (!houseId) {
      return throwError(() => new Error('No house in session'));
    }
    return fetch(houseId);
  }
}
