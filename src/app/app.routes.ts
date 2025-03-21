import { Routes } from '@angular/router';
import { AuthenticationGuard } from './auth-gaurds/authentication.gaurd';
import { LoginComponent } from './login/login.component';

export const APP_ROUTE: Routes = [ {
    path: 'login',
    component: LoginComponent
}, {
    path: '',
    loadChildren:()=>import('./all-Component/all-component.routes').then((m)=>m.AllComponentRoutes),canActivate:[AuthenticationGuard]
},
{
    path: '**',
    redirectTo: '/login'
},

];

