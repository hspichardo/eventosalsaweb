
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormPerson } from '../interfaces/formPerson';
import { Observable, Observer } from 'rxjs';
import { ResponseData } from '../interfaces/ResponseData';
import {Client} from "../interfaces/client";

@Injectable()
export class FormPersonService {

    constructor(private http: HttpClient) { }



    getFormPersons(): Observable<ResponseData> {
        return this.http.get<ResponseData>('https://api.hpichardotesting.com/registration_form');
    }

    getFormPerson(formPerson: FormPerson): Observable<ResponseData> {
        return this.http.get<ResponseData>('https://api.hpichardotesting.com/registration_form/'+ formPerson.id);
    }

    getFormPersonBykey(key: string): Observable<ResponseData> {
        return this.http.post<ResponseData>('https://api.hpichardotesting.com/registration_form/bykey', { key });
    }

    deleteFormPerson(formPerson: FormPerson): Observable<ResponseData>  {
        return this.http.delete<ResponseData>('https://api.hpichardotesting.com/registration_form/' + formPerson.id)
    }

    updateFormPerson(formPerson: FormPerson): Observable<ResponseData> {
        return this.http.put<ResponseData>('https://api.hpichardotesting.com/registration_form', formPerson)
    }

    newFormPerson(formPerson: FormPerson): Observable<ResponseData> {
        return this.http.post<ResponseData>('https://api.hpichardotesting.com/formPersons', formPerson)
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
            this.http.delete<ResponseData>('https://api.hpichardotesting.com/registration_form/'+ formPersons[i].id).subscribe(deleteObserver)
        }
        //TODO: list non deleted formPerson and report
        return 0;
    }


    getFormPersonsByClientId(selectedClientEntity: Client): Observable<ResponseData> {
        return this.http.get<ResponseData>('https://api.hpichardotesting.com/client_accreditation/client/registration_forms/' + selectedClientEntity.id);
    }
}
