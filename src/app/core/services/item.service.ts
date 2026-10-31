import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, delay, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CreateItemRequest,
  Item,
  ItemQuery,
  ItemResponse,
  ItemStats,
  itemStatus,
} from '../models/item.model';
import { Page } from '../models/pagination.model';
import { Tag } from '../models/tag.model';
import { CachedResource } from '../utils/cached-resource';
import { ActivityService } from './activity.service';
import { MOCK_TAGS } from './tag.service';

const ATTENTION_PREVIEW_LIMIT = 3;

// TODO(backend): no /items routes exist yet. Shapes below are guesses (a dedicated stats
// summary + a house-scoped, searchable, tag-filtered and paginated item list, per CLAUDE.md's
// House-scoping rule) — confirm against the backend repo before wiring real HTTP calls in
// place of these mocks.
const MOCK_STATS: ItemStats = { ok: 42, low: 8, out: 3 };

function mockTags(...names: string[]): Tag[] {
  return MOCK_TAGS.filter((tag) => names.includes(tag.name));
}

const MOCK_ITEMS: Item[] = [
  {
    id: 'mock-item-1',
    name: 'Detergente Ypê',
    icon: 'soap',
    imageUrl: null,
    unit: 'unit',
    quantity: 1,
    restockThreshold: 2,
    tags: mockTags('Limpeza', 'Cozinha'),
    houseId: 'mock-house-1',
  },
  {
    id: 'mock-item-2',
    name: 'Arroz Agulhinha (5kg)',
    icon: 'rice_bowl',
    imageUrl: null,
    unit: 'unit',
    quantity: 2,
    restockThreshold: 1,
    tags: mockTags('Despensa', 'Grãos'),
    houseId: 'mock-house-1',
  },
  {
    id: 'mock-item-3',
    name: 'Papel Higiênico (12 un)',
    icon: 'wc',
    imageUrl: null,
    unit: 'unit',
    quantity: 0,
    restockThreshold: 2,
    tags: mockTags('Higiene', 'Banheiro'),
    houseId: 'mock-house-1',
  },
  {
    id: 'mock-item-4',
    name: 'Café Torrado (500g)',
    icon: 'coffee',
    imageUrl: null,
    unit: 'unit',
    quantity: 3,
    restockThreshold: 1,
    tags: mockTags('Despensa', 'Bebidas'),
    houseId: 'mock-house-1',
  },
  {
    id: 'mock-item-5',
    name: 'Feijão Carioca (1kg)',
    icon: 'rice_bowl',
    imageUrl: null,
    unit: 'unit',
    quantity: 1,
    restockThreshold: 2,
    tags: mockTags('Despensa', 'Grãos'),
    houseId: 'mock-house-1',
  },
  {
    id: 'mock-item-6',
    name: 'Sabonete',
    icon: 'soap',
    imageUrl: null,
    unit: 'unit',
    quantity: 1,
    restockThreshold: 2,
    tags: mockTags('Higiene', 'Banheiro'),
    houseId: 'mock-house-1',
  },
  {
    id: 'mock-item-7',
    name: 'Macarrão Espaguete',
    icon: 'ramen_dining',
    imageUrl: null,
    unit: 'unit',
    quantity: 4,
    restockThreshold: 2,
    tags: mockTags('Despensa'),
    houseId: 'mock-house-1',
  },
  {
    id: 'mock-item-8',
    name: 'Óleo de Soja',
    icon: 'water_drop',
    imageUrl: null,
    unit: 'unit',
    quantity: 2,
    restockThreshold: 1,
    tags: mockTags('Despensa', 'Cozinha'),
    houseId: 'mock-house-1',
  },
  {
    id: 'mock-item-9',
    name: 'Açúcar Refinado (1kg)',
    icon: 'cookie',
    imageUrl: null,
    unit: 'unit',
    quantity: 0,
    restockThreshold: 1,
    tags: mockTags('Despensa'),
    houseId: 'mock-house-1',
  },
  {
    id: 'mock-item-10',
    name: 'Sal Refinado',
    icon: 'grain',
    imageUrl: null,
    unit: 'unit',
    quantity: 2,
    restockThreshold: 1,
    tags: mockTags('Despensa', 'Cozinha'),
    houseId: 'mock-house-1',
  },
  {
    id: 'mock-item-11',
    name: 'Leite Integral',
    icon: 'local_drink',
    imageUrl: null,
    unit: 'unit',
    quantity: 6,
    restockThreshold: 3,
    tags: mockTags('Bebidas', 'Frios'),
    houseId: 'mock-house-1',
  },
  {
    id: 'mock-item-12',
    name: 'Pão de Forma',
    icon: 'bakery_dining',
    imageUrl: null,
    unit: 'unit',
    quantity: 1,
    restockThreshold: 1,
    tags: mockTags('Padaria'),
    houseId: 'mock-house-1',
  },
  {
    id: 'mock-item-13',
    name: 'Manteiga',
    icon: 'egg',
    imageUrl: null,
    unit: 'unit',
    quantity: 1,
    restockThreshold: 1,
    tags: mockTags('Frios', 'Padaria'),
    houseId: 'mock-house-1',
  },
  {
    id: 'mock-item-14',
    name: 'Ovos (dúzia)',
    icon: 'egg_alt',
    imageUrl: null,
    unit: 'unit',
    quantity: 12,
    restockThreshold: 6,
    tags: mockTags('Frios'),
    houseId: 'mock-house-1',
  },
  {
    id: 'mock-item-15',
    name: 'Banana Prata',
    icon: 'nutrition',
    imageUrl: null,
    unit: 'kg',
    quantity: 0,
    restockThreshold: 2,
    tags: mockTags('Hortifruti'),
    houseId: 'mock-house-1',
  },
  {
    id: 'mock-item-16',
    name: 'Tomate',
    icon: 'nutrition',
    imageUrl: null,
    unit: 'kg',
    quantity: 3,
    restockThreshold: 2,
    tags: mockTags('Hortifruti', 'Cozinha'),
    houseId: 'mock-house-1',
  },
  {
    id: 'mock-item-17',
    name: 'Desinfetante',
    icon: 'sanitizer',
    imageUrl: null,
    unit: 'unit',
    quantity: 2,
    restockThreshold: 1,
    tags: mockTags('Limpeza', 'Banheiro'),
    houseId: 'mock-house-1',
  },
  {
    id: 'mock-item-18',
    name: 'Esponja de Louça',
    icon: 'cleaning_services',
    imageUrl: null,
    unit: 'unit',
    quantity: 1,
    restockThreshold: 2,
    tags: mockTags('Limpeza', 'Cozinha'),
    houseId: 'mock-house-1',
  },
  {
    id: 'mock-item-19',
    name: 'Shampoo',
    icon: 'shower',
    imageUrl: null,
    unit: 'unit',
    quantity: 2,
    restockThreshold: 1,
    tags: mockTags('Higiene', 'Banheiro'),
    houseId: 'mock-house-1',
  },
  {
    id: 'mock-item-20',
    name: 'Água Sanitária',
    icon: 'sanitizer',
    imageUrl: null,
    unit: 'unit',
    quantity: 1,
    restockThreshold: 1,
    tags: mockTags('Limpeza'),
    houseId: 'mock-house-1',
  },
];

function normalize(value: string): string {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

function matchesQuery(item: Item, query: ItemQuery): boolean {
  if (query.attentionOnly && itemStatus(item) === 'ok') return false;
  if (query.tagId && !item.tags.some((tag) => tag.id === query.tagId)) return false;
  return normalize(item.name).includes(normalize(query.search));
}

@Injectable({ providedIn: 'root' })
export class ItemService {
  private http = inject(HttpClient);
  private activityService = inject(ActivityService);

  readonly stats = new CachedResource(() => this.getStats());
  readonly attentionPreview = new CachedResource(() => this.getAttentionItems(ATTENTION_PREVIEW_LIMIT));

  getStats(): Observable<ItemStats> {
    return of({ ...MOCK_STATS }).pipe(delay(200));
  }

  getAttentionItems(limit = 3): Observable<Item[]> {
    const items = MOCK_ITEMS.filter((item) => itemStatus(item) !== 'ok').slice(0, limit);
    return of(items).pipe(delay(200));
  }

  getItems(query: ItemQuery): Observable<Page<Item>> {
    const matches = MOCK_ITEMS.filter((item) => matchesQuery(item, query));
    const start = (query.page - 1) * query.pageSize;

    return of({
      data: matches.slice(start, start + query.pageSize),
      total: matches.length,
      page: query.page,
      pageSize: query.pageSize,
    }).pipe(delay(300));
  }

  createItem(houseId: string, payload: CreateItemRequest): Observable<ItemResponse> {
    return this.http
      .post<ItemResponse>(`${environment.apiUrl}/houses/${houseId}/items`, payload)
      .pipe(
        tap(() => {
          this.stats.refresh();
          this.attentionPreview.refresh();
          this.activityService.recentActivity.refresh();
        }),
      );
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
    const item = MOCK_ITEMS.find((current) => current.id === itemId);
    if (item) {
      MOCK_STATS[itemStatus(item)]--;
      MOCK_STATS.ok++;
      item.quantity = item.restockThreshold + 1;
    }
    return of(undefined).pipe(delay(150));
  }
}
