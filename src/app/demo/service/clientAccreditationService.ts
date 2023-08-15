
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClientAccreditation } from '../interfaces/clientAccreditation';
import { Observable, Observer } from 'rxjs';
import { ResponseData } from '../interfaces/ResponseData';
import { Client } from '../interfaces/client';

@Injectable()
export class clientAccreditationService {

    constructor(private http: HttpClient) { }


    getClientAccreditations(): Observable<ResponseData> {
        return this.http.get<ResponseData>('http://localhost:3000/client_accreditation');
    }

    getClientAccreditation(clientAccreditation: ClientAccreditation): Observable<ResponseData> {
        return this.http.get<ResponseData>('http://localhost:3000/client_accreditation/'+ clientAccreditation.id);
    }

    getClientAccreditationByClient(client: Client): Observable<ResponseData> {
        return this.http.get<ResponseData>('http://localhost:3000/client_accreditation/client/'+ client.id);
    }

    deleteClientAccreditation(clientAccreditation: ClientAccreditation): Observable<ResponseData>  {
        return this.http.delete<ResponseData>('http://localhost:3000/client_accreditation/' + clientAccreditation.id)
    }

    updateClientAccreditation(clientAccreditation: ClientAccreditation): Observable<ResponseData> {
        return this.http.put<ResponseData>('http://localhost:3000/client_accreditation', clientAccreditation)
    }

    newClientAccreditation(clientAccreditation: ClientAccreditation): Observable<ResponseData> {
        const body : any = {...clientAccreditation};
        body["accreditation"] = body["accreditation"].id;
        body["client"] = body["client"].id;
        return this.http.post<ResponseData>('http://localhost:3000/client_accreditation', body)
    }


    deleteClientAccreditations(clientAccreditations: ClientAccreditation[]): number{
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

        for (let i = 0; i < clientAccreditations.length; i++) {
            this.http.delete<ResponseData>('http://localhost:3000/clientAccreditations/'+ clientAccreditations[i].id).subscribe(deleteObserver)
        }
        //TODO: list non deleted clientAccreditation and report
        return 0;
    }


}
