import { Routes } from '@angular/router';
import {authGuard} from './shared/guards/auth.guard';
import {loginGuard} from './shared/guards/login.guard';

export const routes: Routes = [
  {
    path: "login",
    loadComponent: () => import("./pages/login/login.component").then(c => c.LoginComponent),
    canActivate: [authGuard]
  },

  {
    path: "admin",
    loadComponent: () => import("./pages/admin/admin.component").then(c => c.AdminComponent),
    loadChildren: () => import("./pages/admin/admin.routes").then(r => r.routes),
    canActivateChild: [loginGuard]
  },

  {
    path: '**',
    redirectTo: 'admin',
  }
];
