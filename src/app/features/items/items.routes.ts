import { Routes } from '@angular/router';

export const ITEMS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./items.component').then((m) => m.ItemsComponent),
  },
  {
    path: 'new',
    loadComponent: () => import('./new-item/new-item.component').then((m) => m.NewItemComponent),
  },
];
