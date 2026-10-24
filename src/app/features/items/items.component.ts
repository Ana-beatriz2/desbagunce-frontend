import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { rxResource, takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Item } from '../../core/models/item.model';
import { pageCount } from '../../core/models/pagination.model';
import { ItemService } from '../../core/services/item.service';
import { TagService } from '../../core/services/tag.service';
import { PrimaryNavComponent } from '../../shared/components/primary-nav/primary-nav.component';
import { ItemCardComponent } from './components/item-card/item-card.component';

const PAGE_SIZE = 8;
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
  private router = inject(Router);

  status = input<string>();

  tags = inject(TagService).tags;
  searchControl = new FormControl('', { nonNullable: true });
  selectedTagId = signal<string | null>(null);
  page = signal(1);
  purchaseStates = signal<Record<string, PurchaseState>>({});

  private search = toSignal(
    this.searchControl.valueChanges.pipe(debounceTime(SEARCH_DEBOUNCE_MS), distinctUntilChanged()),
    { initialValue: '' },
  );

  attentionOnly = computed(() => this.status() === 'attention');
  showingAll = computed(() => !this.attentionOnly() && this.selectedTagId() === null);

  items = rxResource({
    params: () => ({
      search: this.search(),
      tagId: this.selectedTagId(),
      attentionOnly: this.attentionOnly(),
      page: this.page(),
      pageSize: PAGE_SIZE,
    }),
    stream: ({ params }) => this.itemService.getItems(params),
  });

  totalPages = computed(() => {
    const result = this.items.value();
    return result ? pageCount(result) : 1;
  });

  constructor() {
    this.tags.load();
    this.searchControl.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.page.set(1));
  }

  showAll(): void {
    this.selectedTagId.set(null);
    this.page.set(1);
    this.clearAttentionFilter();
  }

  selectTag(tagId: string): void {
    this.selectedTagId.set(tagId);
    this.page.set(1);
    this.clearAttentionFilter();
  }

  goToPage(page: number): void {
    this.page.set(Math.min(Math.max(page, 1), this.totalPages()));
  }

  markPurchased(item: Item): void {
    this.setPurchaseState(item.id, 'pending');
    this.itemService.markPurchased(item.id).subscribe({
      next: () => {
        this.setPurchaseState(item.id, null);
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
