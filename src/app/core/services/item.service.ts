import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { Item, ItemStats } from '../models/item.model';

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
  getStats(): Observable<ItemStats> {
    return of(MOCK_STATS).pipe(delay(200));
  }

  getAttentionItems(limit = 3): Observable<Item[]> {
    return of(MOCK_ATTENTION_ITEMS.slice(0, limit)).pipe(delay(200));
  }

  markPurchased(itemId: string): Observable<void> {
    return of(undefined).pipe(delay(150));
  }
}
