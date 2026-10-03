import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type AvatarSize = 'sm' | 'md';

const SIZE_CLASSES: Record<AvatarSize, string> = {
  sm: 'size-10 text-sm',
  md: 'size-12 text-base',
};

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent {
  name = input.required<string>();
  photoUrl = input<string | null>(null);
  size = input<AvatarSize>('md');

  sizeClasses = computed(() => SIZE_CLASSES[this.size()]);

  initials = computed(() => {
    const parts = this.name().trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '?';
    const first = parts[0][0];
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (first + last).toUpperCase();
  });
}
