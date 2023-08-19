
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormPerson } from '../interfaces/formPerson';
import { Observable, Observer } from 'rxjs';
import { ResponseData } from '../interfaces/ResponseData';

@Injectable()
export class formPersonService {

    constructor(private http: HttpClient) { }

    
    getResponseObservable: Observable<ResponseData> = new Observable<ResponseData>(subscriber => {
        const getResponse : ResponseData = {
            data: [
                {
                    id: 1, counter: 5, key: "string"
                },
                {
                    id: 2, counter: 2, key: "string2"
                },
            ],
            message: "string",
            code: 200,
            status: true
        }

        subscriber.next(getResponse);
        subscriber.complete();
      });

    getFormPersons(): Observable<ResponseData> {
        return this.getResponseObservable;
        // return this.http.get<ResponseData>('http://localhost:3000/registration_form');
    }

    getFormPerson(formPerson: FormPerson): Observable<ResponseData> {
        return this.http.get<ResponseData>('http://localhost:3000/registration_form/'+ formPerson.id);
    }

    deleteFormPerson(formPerson: FormPerson): Observable<ResponseData>  {
        return this.http.delete<ResponseData>('http://localhost:3000/registration_form/' + formPerson.id)
    }

    updateFormPerson(formPerson: FormPerson): Observable<ResponseData> {
        return this.http.put<ResponseData>('http://localhost:3000/registration_form', formPerson)
    }

    newFormPerson(formPerson: FormPerson): Observable<ResponseData> {
        return this.http.post<ResponseData>('http://localhost:3000/formPersons', formPerson)
    }


    deleteFormPersons(formPersons: FormPerson[]): number{
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

        for (let i = 0; i < formPersons.length; i++) {
            this.http.delete<ResponseData>('http://localhost:3000/registration_form/'+ formPersons[i].id).subscribe(deleteObserver)
        }
        //TODO: list non deleted formPerson and report
        return 0;
    }


}
