import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Activity, ActivityAction } from '../../../../core/models/activity.model';
import { AvatarComponent } from '../../../../shared/components/avatar/avatar.component';
import { RelativeTimePipe } from '../../../../shared/pipes/relative-time.pipe';

const SENTENCE_PARTS: Record<ActivityAction, { before: string; after: string }> = {
  purchased: { before: ' marcou ', after: ' como comprado.' },
  added_to_list: { before: ' adicionou ', after: ' à lista de compras.' },
  restocked: { before: ' repôs o estoque de ', after: '.' },
  removed: { before: ' removeu ', after: ' da lista.' },
};

@Component({
  selector: 'app-activity-entry',
  imports: [AvatarComponent, RelativeTimePipe],
  templateUrl: './activity-entry.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityEntryComponent {
  activity = input.required<Activity>();

  sentence = computed(() => SENTENCE_PARTS[this.activity().action]);
}
