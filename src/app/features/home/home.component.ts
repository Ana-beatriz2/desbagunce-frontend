import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Item } from '../../core/models/item.model';
import { ActivityService } from '../../core/services/activity.service';
import { ItemService } from '../../core/services/item.service';
import { UserService } from '../../core/services/user.service';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { PrimaryNavComponent } from '../../shared/components/primary-nav/primary-nav.component';
import { ActivityEntryComponent } from './components/activity-entry/activity-entry.component';
import { AttentionItemComponent } from './components/attention-item/attention-item.component';
import { StatCardComponent } from './components/stat-card/stat-card.component';

type PurchaseState = 'pending' | 'error';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    MatIconModule,
    AvatarComponent,
    PrimaryNavComponent,
    StatCardComponent,
    AttentionItemComponent,
    ActivityEntryComponent,
  ],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private itemService = inject(ItemService);

  session = inject(UserService).currentSession;
  stats = this.itemService.stats;
  attentionItems = this.itemService.attentionPreview;
  recentActivity = inject(ActivityService).recentActivity;

  purchaseStates = signal<Record<string, PurchaseState>>({});

  constructor() {
    this.session.load();
    this.stats.load();
    this.attentionItems.load();
    this.recentActivity.load();
  }

  markPurchased(item: Item): void {
    this.setPurchaseState(item.id, 'pending');
    this.itemService.markPurchased(item.id).subscribe({
      next: () => this.setPurchaseState(item.id, null),
      error: () => this.setPurchaseState(item.id, 'error'),
    });
  }

  private setPurchaseState(itemId: string, state: PurchaseState | null): void {
    this.purchaseStates.update(({ [itemId]: _, ...rest }) => (state ? { ...rest, [itemId]: state } : rest));
  }
}
