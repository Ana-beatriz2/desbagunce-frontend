import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PrimaryNavComponent } from '../primary-nav/primary-nav.component';

@Component({
  selector: 'app-coming-soon',
  imports: [MatIconModule, PrimaryNavComponent],
  templateUrl: './coming-soon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComingSoonComponent {
  title = input('Em breve');
}
