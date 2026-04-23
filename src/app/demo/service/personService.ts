import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Person } from '../interfaces/person';
import { Observable, Observer } from 'rxjs';
import { ResponseData } from '../interfaces/ResponseData';


@Injectable()
export class PersonService {

    constructor(private http: HttpClient) { }


    getPeople(): Observable<ResponseData> {
        return this.http.get<ResponseData>(environment.apiUrl + '/person');
    }

    getPerson(person: Person): Observable<ResponseData> {
        return this.http.get<ResponseData>(environment.apiUrl + '/person/'+ person.id);
    }

    deletePerson(person: Person): Observable<ResponseData>  {
        return this.http.delete<ResponseData>(environment.apiUrl + '/person/' + person.id)
    }

    updatePerson(person: Person): Observable<ResponseData> {
        return this.http.put<ResponseData>(environment.apiUrl + '/person', person)
    }

    newPerson(person: Person): Observable<ResponseData> {
        const body : Object = {...person};
        body['registration_form'] = person.registration_form.id;
        return this.http.post<ResponseData>(environment.apiUrl + '/person', body)
    }


    deletePeople(person: Person[]): number{
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

        for (let i = 0; i < person.length; i++) {
            this.http.delete<ResponseData>(environment.apiUrl + '/person/'+ person[i].id).subscribe(deleteObserver)
        }
        //TODO: list non deleted entity and report
        return 0;
    }


}
