import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth/auth.component';
import { AppRoutingModule } from './routing/routing.component';
import { CheckboxModule } from 'primeng/checkbox';
import { LoginComponent } from './login/login.component';
import {ToastModule, Toast} from 'primeng/toast'
import { managerComponent } from './manager/manager.component';
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
        PanelModule
    ],
  declarations: [
    AuthComponent,
    LoginComponent,
    managerComponent,
    RolesComponent
  ],
  exports:[
  ]
})
export class ModulesModule { }
