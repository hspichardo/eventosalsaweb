import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class RolesService {

    constructor(private http: HttpClient) { }


    async getRoles() {
        return this.http.get<any>('https://6492e75a428c3d2035d0df8b.mockapi.io/mockapi/rol')
        .toPromise()
    }
}
