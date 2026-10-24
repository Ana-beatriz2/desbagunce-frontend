import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Item, ItemStatus, itemStatus, unitLabel } from '../../../../core/models/item.model';

const STATUS_INFO: Record<ItemStatus, { label: string; bg: string; text: string }> = {
  ok: { label: 'OK', bg: 'bg-success/10', text: 'text-success' },
  low: { label: 'Acabando', bg: 'bg-warning/10', text: 'text-warning' },
  out: { label: 'Esgotado', bg: 'bg-danger/10', text: 'text-danger' },
};

const PURCHASE_CLASS: Record<ItemStatus, string> = {
  ok: 'bg-background text-muted',
  low: 'bg-primary/5 text-primary',
  out: 'bg-primary text-white',
};

@Component({
  selector: 'app-item-card',
  imports: [MatIconModule, MatMenuModule],
  templateUrl: './item-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemCardComponent {
  item = input.required<Item>();
  pending = input(false);
  failed = input(false);
  purchased = output<void>();

  private status = computed(() => itemStatus(this.item()));

  statusInfo = computed(() => STATUS_INFO[this.status()]);
  purchaseClass = computed(() => PURCHASE_CLASS[this.status()]);
  quantityLabel = computed(() => `${this.item().quantity} ${unitLabel(this.item().unit)}`);
  tagLabel = computed(() =>
    this.item()
      .tags.map((tag) => tag.name)
      .join(' • '),
  );
}
