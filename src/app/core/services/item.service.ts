import { Injectable, inject } from '@angular/core';
import { Observable, delay, of, tap } from 'rxjs';
import { Item, ItemStats, itemStatus } from '../models/item.model';
import { CachedResource } from '../utils/cached-resource';
import { ActivityService } from './activity.service';

const ATTENTION_PREVIEW_LIMIT = 3;

// TODO(backend): no /items routes exist yet. Shapes below are guesses (a dedicated stats
// summary + a house-scoped item list, per CLAUDE.md's House-scoping rule) — confirm against
// the backend repo before wiring real HTTP calls in place of these mocks.
const MOCK_STATS: ItemStats = { ok: 42, low: 8, out: 3 };

const MOCK_ATTENTION_ITEMS: Item[] = [
  {
    id: 'mock-item-1',
    name: 'Detergente',
    icon: 'soap',
    quantity: 1,
    restockThreshold: 2,
    houseId: 'mock-house-1',
  },
  {
    id: 'mock-item-2',
    name: 'Papel Higiênico',
    icon: 'wc',
    quantity: 0,
    restockThreshold: 2,
    houseId: 'mock-house-1',
  },
  {
    id: 'mock-item-3',
    name: 'Arroz (5kg)',
    icon: 'rice_bowl',
    quantity: 1,
    restockThreshold: 1,
    houseId: 'mock-house-1',
  },
  {
    id: 'mock-item-4',
    name: 'Sabonete',
    icon: 'soap',
    quantity: 1,
    restockThreshold: 2,
    houseId: 'mock-house-1',
  },
];

@Injectable({ providedIn: 'root' })
export class ItemService {
  private activityService = inject(ActivityService);

  readonly stats = new CachedResource(() => this.getStats());
  readonly attentionPreview = new CachedResource(() => this.getAttentionItems(ATTENTION_PREVIEW_LIMIT));

  getStats(): Observable<ItemStats> {
    return of({ ...MOCK_STATS }).pipe(delay(200));
  }

  getAttentionItems(limit = 3): Observable<Item[]> {
    const items = MOCK_ATTENTION_ITEMS.filter((item) => itemStatus(item) !== 'ok').slice(0, limit);
    return of(items).pipe(delay(200));
  }

  markPurchased(itemId: string): Observable<void> {
    return this.postPurchase(itemId).pipe(
      tap(() => {
        this.attentionPreview.update((items) => items.filter((item) => item.id !== itemId));
        this.attentionPreview.refresh();
        this.stats.refresh();
        this.activityService.recentActivity.refresh();
      }),
    );
  }

  private postPurchase(itemId: string): Observable<void> {
    const item = MOCK_ATTENTION_ITEMS.find((current) => current.id === itemId);
    if (item) {
      MOCK_STATS[itemStatus(item)]--;
      MOCK_STATS.ok++;
      item.quantity = item.restockThreshold + 1;
    }
    return of(undefined).pipe(delay(150));
  }
}
