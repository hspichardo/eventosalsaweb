import { HttpResponse } from '@angular/common/http';
import { Component, ViewEncapsulation } from '@angular/core';
import { Observer } from 'rxjs';
import { User } from 'src/app/demo/interfaces/user';
import { UserService } from 'src/app/demo/service/userService';
import { AppRoutingModule } from '../routing/routing.component';
import { Router } from '@angular/router';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { ResponseData } from 'src/app/demo/interfaces/ResponseData';

@Component({
  selector: 'app-createAccount',
  templateUrl: './createAccount.component.html',
  styleUrls: ['./createAccount.component.scss'],
  providers: [MessageService, ConfirmationService]

})
export class createAccountComponent {
  newUser : User;
  msgs: Message[] = [];

  constructor(
    private userService: UserService,
    private router: Router,
    private messageService: MessageService){
    this.newUser = {}
  }

  saveNewUser() {
    const newUserObserver: Observer<any> =  {
       next: async (response: HttpResponse<any>) => {   
        console.log(response)
        const responseData: ResponseData = response.body;

        if(responseData.status)
        {
          localStorage.setItem('access_token', response.body['access_token']);
          
          if (response.status == 201)
          {
            await this.messageService.add({ severity: 'success', summary: 'Éxito', detail: responseData.message, life: 3000 });
            setTimeout(() => {
              this.router.navigate(['login']);
            }, 3500); 
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

    if( this.newUser.username && this.newUser.password)
    {
      this.userService.newUser(this.newUser).subscribe(newUserObserver);
    }
  
  }

}

