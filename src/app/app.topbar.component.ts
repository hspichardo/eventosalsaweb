import { Component } from '@angular/core';
import { AppMainComponent} from './app.main.component';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    user_info : String = '';

    username : String = "";

    constructor(public app: AppMainComponent) {}

    ngOnInit() {
      try 
      {
        this.user_info = jwt_decode(localStorage.getItem("access_token"));
        console.log(this.user_info)
      } 
      catch (error) 
      {
        console.error('Error decoding JWT:', error);
      }

      this.username = this.user_info['username'] || "usuario";

  }
}
