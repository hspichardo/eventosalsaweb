import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {AppMainComponent} from '../../app.main.component';
import {AppNotfoundComponent} from '../../pages/app.notfound.component';
import {AppErrorComponent} from '../../pages/app.error.component';
import {AppAccessdeniedComponent} from '../../pages/app.accessdenied.component';
import { LoginComponent } from '../login/login.component';
import { RolesComponent } from '../roles/roles.component';
import { UsersComponent } from '../users/users.component';
import { LoginGuard } from '../auth/checkRolesGuard';
import { createAccountComponent } from '../createAccount/createAccount.component';
import { CheckLoginGuard } from '../auth/checkLoginGuard';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', component: AppMainComponent,
                children: [
                    {path: '', component: UsersComponent, canActivate:[CheckLoginGuard]},
                    {path: 'roles', component: RolesComponent, canActivate:[CheckLoginGuard]},
                ]
            },
            {path: 'createAccount', component: createAccountComponent},
            {path: 'error', component: AppErrorComponent},
            {path: 'access', component: AppAccessdeniedComponent},
            {path: 'notfound', component: AppNotfoundComponent},
            {path: 'login', component: LoginComponent},
            {path: '**', redirectTo: '/notfound'},
        ], {scrollPositionRestoration: 'enabled'})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
