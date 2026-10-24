import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async (_route, state) => {
  const router = inject(Router);
  const user = await inject(AuthService).resolveCurrentUser();

  if (user) return true;

  return router.createUrlTree(['/login'], { queryParams: { redirectTo: state.url } });
};
