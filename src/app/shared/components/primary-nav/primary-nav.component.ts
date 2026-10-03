import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

interface NavLink {
  path: string;
  label: string;
  icon: string;
  variant?: 'fab';
}

const NAV_LINKS: NavLink[] = [
  { path: '/home', label: 'Início', icon: 'home' },
  { path: '/tags', label: 'Tags', icon: 'sell' },
  { path: '/items', label: 'Itens', icon: 'inventory_2', variant: 'fab' },
  { path: '/activities', label: 'Atividades', icon: 'history' },
  { path: '/settings', label: 'Ajustes', icon: 'settings' },
];

@Component({
  selector: 'app-primary-nav',
  imports: [RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './primary-nav.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrimaryNavComponent {
  links = NAV_LINKS;
}
