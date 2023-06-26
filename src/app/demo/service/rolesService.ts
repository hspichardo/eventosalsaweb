import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Role } from '../interfaces/role';
import { Observable, Observer } from 'rxjs';


@Injectable()
export class RolesService {

    constructor(private http: HttpClient) { }


    getRoles(): Observable<Role[]> {
        return this.http.get<any>('https://6492e75a428c3d2035d0df8b.mockapi.io/mockapi/rol');
    }

    deleteRole(role: Role): Observable<void>  {
        return this.http.delete<any>('https://6492e75a428c3d2035d0df8b.mockapi.io/mockapi/rol/' + role.id)
    }

    updateRole(role: Role): Observable<Role> {
        return this.http.put<Role>('https://6492e75a428c3d2035d0df8b.mockapi.io/mockapi/rol/' + role.id, {nombre:role.name, descripcion:role.description})
    }

    newRole(role: Role): Observable<Role> {
        return this.http.post<Role>('https://6492e75a428c3d2035d0df8b.mockapi.io/mockapi/rol', {nombre:role.name, descripcion:role.description})
    }


    deleteRoles(roles: Role[]): number{
        const deleteObserver : Observer<any> = {
            next: (value: string) => {
                return 0;
            },
            error: (error: any) => {
                console.error(error);
                return 1;
            },
            complete: () => {
                return 0;
            }
        }

        for (let i = 0; i < roles.length; i++) {
            this.http.delete<any>('https://6492e75a428c3d2035d0df8b.mockapi.io/mockapi/rol/' + roles[i].id).subscribe(deleteObserver)
        }
        return 0;
    }


}
