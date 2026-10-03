import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Activity } from '../../core/models/activity.model';
import { Item } from '../../core/models/item.model';
import { ActivityService } from '../../core/services/activity.service';
import { ItemService } from '../../core/services/item.service';
import { UserService } from '../../core/services/user.service';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { PrimaryNavComponent } from '../../shared/components/primary-nav/primary-nav.component';
import { ActivityEntryComponent } from './components/activity-entry/activity-entry.component';
import { AttentionItemComponent } from './components/attention-item/attention-item.component';
import { StatCardComponent } from './components/stat-card/stat-card.component';

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
  private userService = inject(UserService);
  private itemService = inject(ItemService);
  private activityService = inject(ActivityService);

  session = rxResource({ stream: () => this.userService.getCurrentUser() });
  stats = rxResource({ stream: () => this.itemService.getStats(), defaultValue: { ok: 0, low: 0, out: 0 } });
  attentionItems = rxResource({ stream: () => this.itemService.getAttentionItems(3), defaultValue: [] as Item[] });
  recentActivity = rxResource({ stream: () => this.activityService.getRecentActivity(3), defaultValue: [] as Activity[] });

  markPurchased(item: Item): void {
    this.attentionItems.value.update((items) => items.filter((current) => current.id !== item.id));
    this.itemService.markPurchased(item.id).subscribe();
  }
}
