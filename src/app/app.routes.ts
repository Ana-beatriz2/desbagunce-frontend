import { Routes } from '@angular/router';

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
  },
  // The screens below aren't built yet — each nav destination and "Ver todos" link already
  // points at its real future path so nothing needs to change when they land.
  {
    path: 'items',
    loadComponent: () => import('./shared/components/coming-soon/coming-soon.component').then((m) => m.ComingSoonComponent),
    data: { title: 'Itens' },
  },
  {
    path: 'tags',
    loadComponent: () => import('./shared/components/coming-soon/coming-soon.component').then((m) => m.ComingSoonComponent),
    data: { title: 'Tags' },
  },
  {
    path: 'activities',
    loadComponent: () => import('./shared/components/coming-soon/coming-soon.component').then((m) => m.ComingSoonComponent),
    data: { title: 'Atividades' },
  },
  {
    path: 'settings',
    loadComponent: () => import('./shared/components/coming-soon/coming-soon.component').then((m) => m.ComingSoonComponent),
    data: { title: 'Ajustes' },
  },
  {
    path: '**',
    loadComponent: () => import('./shared/components/coming-soon/coming-soon.component').then((m) => m.ComingSoonComponent),
    data: { title: 'Página não encontrada' },
  },
];
