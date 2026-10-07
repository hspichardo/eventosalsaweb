import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth/auth.component';
import { CertificateComponent } from './certificates/certificates.component';
import { FormPersonComponent } from './formPersons/formPersons.component';
import { ClientAccreditationComponent } from './clientAccreditations/clientAccreditations.component';
import { AppRoutingModule } from './routing/routing.component';
import { CheckboxModule } from 'primeng/checkbox';
import { LoginComponent } from './login/login.component';
import {ToastModule, Toast} from 'primeng/toast'
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {FileUploadModule} from "primeng/fileupload";
import {InputTextModule} from "primeng/inputtext";
import {InputTextareaModule} from "primeng/inputtextarea";
import {DropdownModule} from "primeng/dropdown";
import {FormsModule} from "@angular/forms";
import {RadioButtonModule} from "primeng/radiobutton";
import {InputNumberModule} from "primeng/inputnumber";
import { FullCalendarComponent } from '@fullcalendar/angular'; 
import { PanelModule } from 'primeng/panel';
import { RolesComponent } from './roles/roles.component';
import { UsersComponent } from './users/users.component';
import { UserService } from '../demo/service/userService';
import { LoginGuard } from './auth/checkRolesGuard';
import { createAccountComponent } from './createAccount/createAccount.component';
import { AuthenticationService } from '../demo/service/authenticationService';
import { MultiSelectModule } from 'primeng/multiselect';
import { EventEntityComponent } from './eventEntities/eventEntity.component';
import { BenefitComponent } from './benefits/benefits.component';
import { AccreditationComponent } from './accreditations/accreditations.component';
import { ClientComponent } from './client/client.component';
import { AppendBenefitsComponent } from './benefits/appendBenefits/appendBenefits.component';
import { TooltipModule } from 'primeng/tooltip';
import { TicketsService } from '../demo/service/ticketService';
import { PersonService } from '../demo/service/personService';
import { ReportsComponent } from './reports/reports.component';
@NgModule({
    imports: [
        CommonModule,
        AppRoutingModule,
        CheckboxModule,
        ToastModule,
        ToolbarModule,
        TableModule,
        DialogModule,
        ButtonModule,
        RippleModule,
        FileUploadModule,
        InputTextModule,
        InputTextareaModule,
        DropdownModule,
        FormsModule,
        RadioButtonModule,
        InputNumberModule,
        PanelModule,
        MultiSelectModule,
        TooltipModule
    ],
  declarations: [
		CertificateComponent,
		FormPersonComponent,
		ClientAccreditationComponent,
    AuthComponent,
    LoginComponent,
    RolesComponent,
    EventEntityComponent,
    BenefitComponent,
    AccreditationComponent,
    UsersComponent,
    createAccountComponent,
    ClientComponent,
    AppendBenefitsComponent,
    ReportsComponent
  ],
  exports:[
  ],
  providers:[UserService, TicketsService, PersonService, AuthenticationService]
})
export class ModulesModule { }
