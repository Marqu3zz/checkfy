import {Routes} from "@angular/router";
import {loginGuard} from '../../shared/guards/login.guard';

export const routes: Routes = [
  {
    path: 'customers',
    loadComponent: () => import("./customer-list/customer-list.component").then(c => c.CustomerListComponent),
    canActivateChild: [loginGuard]
  },
  {
    path: "users",
    loadComponent: () => import("./user-list/user-list.component").then(c => c.UserListComponent),
    canActivateChild: [loginGuard]
  },
  {
    path: 'users/:id',
    loadComponent: () => import("./user-form/user-form.component").then(c => c.UserFormComponent),
    canActivateChild: [loginGuard]
  },
  {
    path: "**",
    redirectTo: "customers",
  }
];
