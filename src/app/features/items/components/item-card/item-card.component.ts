import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Item, ItemStatus, itemIcon, unitLabel } from '../../../../core/models/item.model';

const STATUS_INFO: Record<ItemStatus, { label: string; bg: string; text: string }> = {
  in_stock: { label: 'OK', bg: 'bg-success/10', text: 'text-success' },
  running_low: { label: 'Acabando', bg: 'bg-warning/10', text: 'text-warning' },
  probably_out: { label: 'Provavelmente acabou', bg: 'bg-warning/10', text: 'text-warning' },
  out_of_stock: { label: 'Esgotado', bg: 'bg-danger/10', text: 'text-danger' },
};

const PURCHASE_CLASS: Record<ItemStatus, string> = {
  in_stock: 'bg-background text-muted',
  running_low: 'bg-primary/5 text-primary',
  probably_out: 'bg-primary/5 text-primary',
  out_of_stock: 'bg-primary text-white',
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

  statusInfo = computed(() => STATUS_INFO[this.item().status]);
  purchaseClass = computed(() => PURCHASE_CLASS[this.item().status]);
  icon = computed(() => itemIcon(this.item()));
  quantityLabel = computed(() => `${this.item().currentQuantity} ${unitLabel(this.item().unit)}`);
  tagLabel = computed(() =>
    this.item()
      .tags.map((tag) => tag.name)
      .join(' • '),
  );
}
