import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Item, ItemStatus, itemIcon } from '../../../../core/models/item.model';

const STATUS_INFO: Record<ItemStatus, { label: string; bg: string; text: string }> = {
  in_stock: { label: 'OK', bg: 'bg-success/10', text: 'text-success' },
  running_low: { label: 'Acabando', bg: 'bg-warning/10', text: 'text-warning' },
  probably_out: { label: 'Provavelmente acabou', bg: 'bg-warning/10', text: 'text-warning' },
  out_of_stock: { label: 'Esgotado', bg: 'bg-danger/10', text: 'text-danger' },
};

@Component({
  selector: 'app-attention-item',
  imports: [MatIconModule],
  templateUrl: './attention-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttentionItemComponent {
  item = input.required<Item>();
  pending = input(false);
  failed = input(false);
  purchased = output<void>();

  statusInfo = computed(() => STATUS_INFO[this.item().status]);
  icon = computed(() => itemIcon(this.item()));
}
