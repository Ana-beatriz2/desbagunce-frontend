import { Routes } from '@angular/router';

export const ITEMS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./items.component').then((m) => m.ItemsComponent),
  },
  {
    path: 'new',
    loadComponent: () => import('../../shared/components/coming-soon/coming-soon.component').then((m) => m.ComingSoonComponent),
    data: { title: 'Novo item' },
  },
];
