import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { Observable, Observer } from 'rxjs';

@Injectable()
export class UserService {

    constructor(private http: HttpClient) { }
    

    getUsers(): Observable<User[]> {
        return this.http.get<any>('https://6492e75a428c3d2035d0df8b.mockapi.io/mockapi/usuario');
    }

    deleteUser(user: User): Observable<void>  {
        return this.http.delete<any>('https://6492e75a428c3d2035d0df8b.mockapi.io/mockapi/usuario/' + user.id)
    }

    updateUser(user: User): Observable<User> {
        return this.http.put<User>(
            'https://6492e75a428c3d2035d0df8b.mockapi.io/mockapi/usuario/' + user.id,
            {
                "nombre": user.name,
                "apellido": user.lastName,
                "email": user.email,
            })
    }

    newUser(user: User): Observable<User> {
        return this.http.post<User>('https://6492e75a428c3d2035d0df8b.mockapi.io/mockapi/usuario', 
            {
                "nombre": user.name,
                "apellido": user.lastName,
                "email": user.email,
            })
    }


    deleteUsers(users: User[]): number{
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

        for (let i = 0; i < users.length; i++) {
            this.http.delete<any>('https://6492e75a428c3d2035d0df8b.mockapi.io/mockapi/usuario/' + users[i].id).subscribe(deleteObserver)
        }
        return 0;
    }



}
