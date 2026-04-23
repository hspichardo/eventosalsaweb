import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { User } from '../interfaces/user';
import { Observable, Observer } from 'rxjs';

@Injectable()
export class AuthenticationService {

    constructor(private http: HttpClient) { }


    login(user: User): any {
        return this.http.post<HttpResponse<any>>(environment.apiUrl + '/auth/login',
        {
            "username":user.username,
            "password": user.password
        },{observe: 'response'});
    }

}
