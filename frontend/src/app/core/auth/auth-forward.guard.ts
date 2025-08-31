import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import {MatSnackBar} from "@angular/material/snack-bar";

export const authForwardGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const _snackBar = inject(MatSnackBar);

  if (authService.isLoggedIn()) {
    return true;
  } else {
    _snackBar.open('Для доступа необходимо авторизоваться!');
    return router.createUrlTree(['login'], {
      queryParams: { returnUrl: state.url }
    });
  }
};
