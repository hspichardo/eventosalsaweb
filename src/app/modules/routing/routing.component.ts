import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {AppMainComponent} from '../../app.main.component';
import {AppNotfoundComponent} from '../../pages/app.notfound.component';
import {AppErrorComponent} from '../../pages/app.error.component';
import {AppAccessdeniedComponent} from '../../pages/app.accessdenied.component';
import { LoginComponent } from '../login/login.component';
import { RolesComponent } from '../roles/roles.component';
import { UsersComponent } from '../users/users.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', component: AppMainComponent,
                children: [
                    {path: '', component: UsersComponent},
                    {path: 'roles', component: RolesComponent},
                ]
            },
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
