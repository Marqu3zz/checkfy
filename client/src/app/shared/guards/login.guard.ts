import {CanActivateChildFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth.service';

export const loginGuard: CanActivateChildFn = async (childRoute, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const authenticated: boolean = await authService.authenticate();

  if (!authenticated) {
    await router.navigate(["login"]);
    return false;
  }

  return true;
};
