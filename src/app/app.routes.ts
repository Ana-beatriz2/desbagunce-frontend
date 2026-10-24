import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'register', pathMatch: 'full' },
  {
    path: 'register',
    loadChildren: () => import('./features/register/register.routes').then((m) => m.REGISTER_ROUTES),
  },
  {
    path: 'login',
    loadChildren: () => import('./features/login/login.routes').then((m) => m.LOGIN_ROUTES),
  },
  {
    path: 'create-house',
    loadChildren: () => import('./features/create-house/create-house.routes').then((m) => m.CREATE_HOUSE_ROUTES),
  },
  {
    path: 'home',
    loadChildren: () => import('./features/home/home.routes').then((m) => m.HOME_ROUTES),
    canActivate: [authGuard],
  },
  // The screens below aren't built yet — each nav destination and "Ver todos" link already
  // points at its real future path so nothing needs to change when they land.
  {
    path: 'items',
    loadComponent: () => import('./shared/components/coming-soon/coming-soon.component').then((m) => m.ComingSoonComponent),
    data: { title: 'Itens' },
    canActivate: [authGuard],
  },
  {
    path: 'tags',
    loadComponent: () => import('./shared/components/coming-soon/coming-soon.component').then((m) => m.ComingSoonComponent),
    data: { title: 'Tags' },
    canActivate: [authGuard],
  },
  {
    path: 'activities',
    loadComponent: () => import('./shared/components/coming-soon/coming-soon.component').then((m) => m.ComingSoonComponent),
    data: { title: 'Atividades' },
    canActivate: [authGuard],
  },
  {
    path: 'settings',
    loadComponent: () => import('./shared/components/coming-soon/coming-soon.component').then((m) => m.ComingSoonComponent),
    data: { title: 'Ajustes' },
    canActivate: [authGuard],
  },
  {
    path: '**',
    loadComponent: () => import('./shared/components/coming-soon/coming-soon.component').then((m) => m.ComingSoonComponent),
    data: { title: 'Página não encontrada' },
    canActivate: [authGuard],
  },
];
