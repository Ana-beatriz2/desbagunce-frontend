import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'register', pathMatch: 'full' },
  {
    path: 'register',
    loadChildren: () => import('./features/register/register.routes').then((m) => m.REGISTER_ROUTES),
  },
  {
    path: 'create-house',
    loadChildren: () => import('./features/create-house/create-house.routes').then((m) => m.CREATE_HOUSE_ROUTES),
  },
];
