import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from "@angular/router";
import { CheckRolesService } from "./checkRolesService";



export const LoginGuard: CanActivateFn = () => {
  console.log("se esta verificando el token de sesion del usuario2");
  return (inject(CheckRolesService).canActivate("njin"));

};