import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { User } from '../interfaces/user';
import { Observable, Observer, elementAt } from 'rxjs';
import { ResponseData } from '../interfaces/ResponseData';

@Injectable()
export class UserService {

    constructor(private http: HttpClient) { }


    getUsers(): Observable<ResponseData> {
        return this.http.get<any>(environment.apiUrl + '/users');
    }

    getUser(username:string): Observable<ResponseData> {
        return this.http.get<ResponseData>(environment.apiUrl + '/users/'+username);
    }

    deleteUser(user: User): Observable<ResponseData>  {
        const headers = new HttpHeaders({
            'authorization': 'Bearer '+ localStorage.getItem('access_token'),
        });

        return this.http.delete<ResponseData>(environment.apiUrl + '/users/' + user.username, { headers: headers })
    }

    updateUser(user: User): any {

        const headers = new HttpHeaders({
            'authorization': 'Bearer '+ localStorage.getItem('access_token'),
        });
        var result : any = null;

        if (user.password){
            result = this.http.put<HttpResponse<any>>(environment.apiUrl + '/users/update/password',
            {
                "username": user.username,
                "password": user.password,
            },
            {headers: headers})
        }

        if (result == null || result.status == 200){
            return this.http.put<HttpResponse<any>>(environment.apiUrl + '/users/update/roles',
            {
                "username": user.username,
                "roleCodes": user.roles.map(element => element.code)
            },
            { headers: headers })

        }

    }

    newUser(user: User): any {
        return this.http.post<HttpResponse<any>>(environment.apiUrl + '/users',
            {
                "username": user.username,
                "password": user.password,
                "roleCodes": user.roles? user.roles.map(element => element.code): []
            },{observe: 'response'})

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
            this.http.delete<any>('https://6492e75a428c3d2035d0df8b.mockapi.io/mockapi/usuario/' + users[i].username).subscribe(deleteObserver)
        }
        return 0;
    }



}
