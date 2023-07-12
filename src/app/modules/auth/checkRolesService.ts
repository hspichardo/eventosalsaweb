import { Injectable } from "@angular/core";

@Injectable()
export class CheckRolesService {

  canActivate(userId: string): boolean {
    console.log("canActivate");

    return true;
  }

  canMatch(currentUser: String): boolean {
    console.log("canMatch");
    return true;
  }

}