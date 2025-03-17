import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const authenticated: boolean = await authService.authenticate();

  if (authenticated) {
    await router.navigate([""]);
    return false;
  }

  return true;
};
