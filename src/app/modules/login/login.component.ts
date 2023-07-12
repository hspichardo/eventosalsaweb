import { HttpResponse } from '@angular/common/http';
import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Observer } from 'rxjs';
import { User } from 'src/app/demo/interfaces/user';
import { AuthenticationService } from 'src/app/demo/service/authenticationService';
import { UserService } from 'src/app/demo/service/userService';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent {

  user: User;

  login(){
    console.log(this.user)
    const loginObserver: Observer<any> = {
      next: (response: HttpResponse<any>) => { 
        localStorage.setItem('access_token', response.body['access_token']);
        
        if (response.status == 200){
          this.router.navigate(['']);
        }
        return true;
      },
      error: (error: any) => {
          console.error(error);
          return 1;
      },
      complete: () => {
          return 0;
      }
    };

    this.authentication.login(this.user).subscribe(loginObserver);
  
  }


  constructor(private authentication: AuthenticationService, private router: Router){
    this.user = {}
  }

}

