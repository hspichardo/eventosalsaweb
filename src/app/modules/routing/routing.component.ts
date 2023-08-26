import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {AppMainComponent} from '../../app.main.component';
import {AppNotfoundComponent} from '../../pages/app.notfound.component';
import {AppErrorComponent} from '../../pages/app.error.component';
import {AppAccessdeniedComponent} from '../../pages/app.accessdenied.component';
import { LoginComponent } from '../login/login.component';
import { RolesComponent } from '../roles/roles.component';
import { UsersComponent } from '../users/users.component';
import { CertificateComponent } from '../certificates/certificates.component';
import { FormPersonComponent } from '../formPersons/formPersons.component';
import { ClientAccreditationComponent } from '../clientAccreditations/clientAccreditations.component';
import { LoginGuard } from '../auth/checkRolesGuard';
import { createAccountComponent } from '../createAccount/createAccount.component';
import { CheckLoginGuard } from '../auth/checkLoginGuard';
import { EventEntityComponent } from '../eventEntities/eventEntity.component';
import { BenefitComponent } from '../benefits/benefits.component';
import { AccreditationComponent } from '../accreditations/accreditations.component';
import { ClientComponent } from '../client/client.component';
import { FormComponent } from '../form/form.component';
import { AppendBenefitsComponent } from '../benefits/appendBenefits/appendBenefits.component';
import { SuccessRegisterComponent } from '../successRegister/successRegister.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', component: AppMainComponent,
                children: [
                    {path: '', component: UsersComponent, canActivate:[CheckLoginGuard]},
					{path: 'certificados', component: CertificateComponent, canActivate:[CheckLoginGuard]},
					{path: 'formulario_personas', component: FormPersonComponent, canActivate:[CheckLoginGuard]},
					{path: 'acreditacion_cliente', component: ClientAccreditationComponent, canActivate:[CheckLoginGuard]},
                    {path: 'roles', component: RolesComponent, canActivate:[CheckLoginGuard]},
                    {path: 'eventos', component: EventEntityComponent, canActivate:[CheckLoginGuard]},
                    {path: 'beneficios', component: BenefitComponent, canActivate:[CheckLoginGuard]},
					{path: 'asignar_beneficios', component: AppendBenefitsComponent, canActivate:[CheckLoginGuard]},
                    {path: 'acreditaciones', component: AccreditationComponent, canActivate:[CheckLoginGuard]},
                    {path: 'clientes', component: ClientComponent, canActivate:[CheckLoginGuard]},
                ]
            },
            {path: 'form/:key', component: FormComponent},
            {path: 'createAccount', component: createAccountComponent},
            {path: 'error', component: AppErrorComponent},
            {path: 'access', component: AppAccessdeniedComponent},
            {path: 'notfound', component: AppNotfoundComponent},
            {path: 'registro_exitoso', component: SuccessRegisterComponent},
            {path: 'login', component: LoginComponent},
            {path: '**', redirectTo: '/notfound'},
        ], {scrollPositionRestoration: 'enabled'})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
