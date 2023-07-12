import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";



export const CheckLoginGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
) => {

  const router: Router = inject(Router);

  if (localStorage.getItem('access_token') == 'undefined' || localStorage.getItem('access_token') == null){
    return router.navigate(['login'])
  }

  return  true


};
