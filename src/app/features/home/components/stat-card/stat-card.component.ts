import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type StatTone = 'success' | 'warning' | 'danger';

const TONE_CLASSES: Record<StatTone, string> = {
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
};

@Component({
  selector: 'app-stat-card',
  templateUrl: './stat-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatCardComponent {
  value = input.required<number>();
  label = input.required<string>();
  tone = input.required<StatTone>();

  toneClass = computed(() => TONE_CLASSES[this.tone()]);
}
