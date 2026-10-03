import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Item, itemStatus } from '../../../../core/models/item.model';

const STATUS_INFO = {
  low: { label: 'Acabando', bg: 'bg-warning/10', text: 'text-warning' },
  out: { label: 'Esgotado', bg: 'bg-danger/10', text: 'text-danger' },
};

@Component({
  selector: 'app-attention-item',
  imports: [MatIconModule],
  templateUrl: './attention-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttentionItemComponent {
  item = input.required<Item>();
  purchased = output<void>();

  statusInfo = computed(() => STATUS_INFO[itemStatus(this.item()) === 'out' ? 'out' : 'low']);
}
