import { Routes } from '@angular/router';


export const routes: Routes = [
  {
    path: 'reset-password',
    loadComponent: () => import('./components/reset-password/reset-password.component').then(m => m.ResetPasswordComponent),
  },
  {
    path: 'user-list',
    loadComponent: () => import('./components/user-list/user-list.component').then(m => m.UserListComponent),
  },
//   {
//     path: 'login',
//     loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent),
//   },
 
];