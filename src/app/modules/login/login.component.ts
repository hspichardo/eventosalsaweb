import { HttpResponse } from '@angular/common/http';
import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { Observer } from 'rxjs';
import { ResponseData } from 'src/app/demo/interfaces/ResponseData';
import { User } from 'src/app/demo/interfaces/user';
import { AuthenticationService } from 'src/app/demo/service/authenticationService';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class LoginComponent {

  user: User;
  msgs: Message[] = [];

  constructor(
    private authentication: AuthenticationService,
    private router: Router,
    private messageService: MessageService){
    this.user = {}
  }

  login(){
    const loginObserver: Observer<any> = {
      next: (response: HttpResponse<any>) => { 
        console.log(response)
        const responseData: ResponseData = response.body;

        if(responseData.status || response.body['access_token'])
        {
          localStorage.setItem('access_token', response.body['access_token']);
          
          if (response.status == 200)
          {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: "Sesión iniciada", life: 1500 });
            setTimeout(() => {
              this.router.navigate(['']);
            }, 1500); 
          }
          return true;

        }
        else
        {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: responseData.message, life: 3000 });
        }
        return false;
      },
      error: (error: any) => {
          console.error(error);
          return 1;
      },
      complete: () => {
          return 0;
      }
    };

    if(this.user.username && this.user.password)
    {
      this.authentication.login(this.user).subscribe(loginObserver);
    }
  
  }

}

