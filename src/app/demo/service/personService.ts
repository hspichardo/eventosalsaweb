import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Person } from '../interfaces/person';
import { Observable, Observer } from 'rxjs';
import { ResponseData } from '../interfaces/ResponseData';


@Injectable()
export class PersonService {

    constructor(private http: HttpClient) { }


    getPeople(): Observable<ResponseData> {
        return this.http.get<ResponseData>('http://localhost:3000/person');
    }

    getPerson(person: Person): Observable<ResponseData> {
        return this.http.get<ResponseData>('http://localhost:3000/person/'+ person.id);
    }

    deletePerson(person: Person): Observable<ResponseData>  {
        return this.http.delete<ResponseData>('http://localhost:3000/person/' + person.id)
    }

    updatePerson(person: Person): Observable<ResponseData> {
        return this.http.put<ResponseData>('http://localhost:3000/person', person)
    }

    newPerson(person: Person): Observable<ResponseData> {
        const body : Object = {...person};
        body['registration_form'] = person.registration_form.id;
        return this.http.post<ResponseData>('http://localhost:3000/person', body)
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
            this.http.delete<ResponseData>('http://localhost:3000/person/'+ person[i].id).subscribe(deleteObserver)
        }
        //TODO: list non deleted entity and report
        return 0;
    }


}
