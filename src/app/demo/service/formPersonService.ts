
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormPerson } from '../interfaces/formPerson';
import { Observable, Observer } from 'rxjs';
import { ResponseData } from '../interfaces/ResponseData';

@Injectable()
export class FormPersonService {

    constructor(private http: HttpClient) { }

    

    getFormPersons(): Observable<ResponseData> {
        return this.http.get<ResponseData>('http://localhost:3000/registration_form');
    }

    getFormPerson(formPerson: FormPerson): Observable<ResponseData> {
        return this.http.get<ResponseData>('http://localhost:3000/registration_form/'+ formPerson.id);
    }

    getFormPersonBykey(key: string): Observable<ResponseData> {
        return this.http.post<ResponseData>('http://localhost:3000/registration_form/bykey', { key });
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
