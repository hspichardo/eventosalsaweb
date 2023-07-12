import { HttpResponse } from '@angular/common/http';
import { Component, ViewEncapsulation } from '@angular/core';
import { Observer } from 'rxjs';
import { User } from 'src/app/demo/interfaces/user';
import { UserService } from 'src/app/demo/service/userService';
import { AppRoutingModule } from '../routing/routing.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-createAccount',
  templateUrl: './createAccount.component.html',
  styleUrls: ['./createAccount.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class createAccountComponent {
  newUser : User

  saveNewUser() {
    const newUserObserver: Observer<any> = {
      next: (response: HttpResponse<any>) => {   
        console.log(response.status)

        if (response.status == 201){
          this.router.navigate(['login']);
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

    this.userService.newUser(this.newUser).subscribe(newUserObserver);
  
  }

  constructor(private userService: UserService, private router: Router){
    this.newUser = {}
  }
}

