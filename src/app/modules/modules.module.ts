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

@NgModule({
  imports: [
    CommonModule,
    AppRoutingModule,
    CheckboxModule,
    ToastModule,
    ToolbarModule,
    TableModule,
    DialogModule,
  ],
  declarations: [
    AuthComponent,
    LoginComponent,
    managerComponent,
  ],
  exports:[
  ]
})
export class ModulesModule { }
