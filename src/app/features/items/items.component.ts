import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
  signal,
  untracked,
} from '@angular/core';
import { rxResource, takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ATTENTION_STATUSES, Item } from '../../core/models/item.model';
import { Page, pageCount } from '../../core/models/pagination.model';
import { ItemService } from '../../core/services/item.service';
import { NotificationService } from '../../core/services/notification.service';
import { TagService } from '../../core/services/tag.service';
import { UserService } from '../../core/services/user.service';
import { PrimaryNavComponent } from '../../shared/components/primary-nav/primary-nav.component';
import { ItemCardComponent } from './components/item-card/item-card.component';

const PAGE_SIZE = 3;
const SEARCH_DEBOUNCE_MS = 300;
const CHIP_SELECTED = 'border-primary bg-primary text-white';
const CHIP_IDLE = 'border-border bg-surface text-ink';
const PAGER_ENABLED = 'bg-ink text-white';
const PAGER_DISABLED = 'border border-border bg-surface text-muted opacity-50';

type PurchaseState = 'pending' | 'error';

@Component({
  selector: 'app-items',
  imports: [ReactiveFormsModule, RouterLink, MatIconModule, PrimaryNavComponent, ItemCardComponent],
  templateUrl: './items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemsComponent {
  private itemService = inject(ItemService);
  private notifications = inject(NotificationService);
  private router = inject(Router);

  status = input<string>();

  session = inject(UserService).currentSession;
  tags = inject(TagService).tags;
  searchControl = new FormControl('', { nonNullable: true });
  selectedTagIds = signal<string[]>([]);
  page = signal(1);
  purchaseStates = signal<Record<string, PurchaseState>>({});

  private search = toSignal(
    this.searchControl.valueChanges.pipe(debounceTime(SEARCH_DEBOUNCE_MS), distinctUntilChanged()),
    { initialValue: '' },
  );

  attentionOnly = computed(() => this.status() === 'attention');
  showingAll = computed(() => !this.attentionOnly() && this.selectedTagIds().length === 0);

  // Returning undefined keeps the resource idle: without a houseId there is no
  // URL to call, and the session arrives a tick after the screen opens.
  private request = computed(() => {
    const houseId = this.session.value()?.user.houseId;
    if (!houseId) return undefined;

    return {
      houseId,
      query: {
        search: this.search(),
        tagIds: this.selectedTagIds(),
        status: this.attentionOnly() ? ATTENTION_STATUSES : undefined,
        page: this.page(),
        pageSize: PAGE_SIZE,
      },
    };
  });

  items = rxResource({
    params: () => this.request(),
    stream: ({ params }) => this.itemService.getItems(params.houseId, params.query),
  });

  // Keeps something on screen while a request is in flight: the page already rendered
  // when turning pages, or the service's cached page when the screen was just reopened.
  // Without it the resource blanks its value and the list flashes a skeleton.
  displayedPage = linkedSignal<Page<Item> | undefined, Page<Item> | undefined>({
    source: () => this.items.value(),
    computation: (incoming, previous) => incoming ?? previous?.value ?? this.cachedPage(),
  });

  totalPages = computed(() => {
    const result = this.displayedPage();
    return result ? pageCount(result) : 1;
  });

  constructor() {
    this.session.load();
    this.searchControl.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.page.set(1));

    effect(() => {
      if (this.session.value()) {
        untracked(() => this.tags.load());
      }
    });
  }

  showAll(): void {
    this.selectedTagIds.set([]);
    this.page.set(1);
    this.clearAttentionFilter();
  }

  toggleTag(tagId: string): void {
    this.selectedTagIds.update((ids) =>
      ids.includes(tagId) ? ids.filter((id) => id !== tagId) : [...ids, tagId],
    );
    this.page.set(1);
    this.clearAttentionFilter();
  }

  isTagSelected(tagId: string): boolean {
    return this.selectedTagIds().includes(tagId);
  }

  goToPage(page: number): void {
    this.page.set(Math.min(Math.max(page, 1), this.totalPages()));
  }

  markPurchased(item: Item): void {
    this.setPurchaseState(item.id, 'pending');
    this.itemService.markPurchased(item.id).subscribe({
      next: () => {
        this.setPurchaseState(item.id, null);
        this.notifications.success(`Compra de ${item.name} registrada.`);
        this.items.reload();
      },
      error: () => this.setPurchaseState(item.id, 'error'),
    });
  }

  chipClass(selected: boolean): string {
    return selected ? CHIP_SELECTED : CHIP_IDLE;
  }

  pagerClass(enabled: boolean): string {
    return enabled ? PAGER_ENABLED : PAGER_DISABLED;
  }

  private cachedPage(): Page<Item> | undefined {
    const request = this.request();
    if (!request) return undefined;
    return this.itemService.cachedItems(request.houseId, request.query) ?? undefined;
  }

  private clearAttentionFilter(): void {
    if (this.attentionOnly()) {
      this.router.navigate(['/items']);
    }
  }

  private setPurchaseState(itemId: string, state: PurchaseState | null): void {
    this.purchaseStates.update(({ [itemId]: _, ...rest }) =>
      state ? { ...rest, [itemId]: state } : rest,
    );
  }
}
