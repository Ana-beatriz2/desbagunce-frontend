import { Routes } from '@angular/router';

export const CREATE_HOUSE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./create-house.component').then((m) => m.CreateHouseComponent),
  },
];
