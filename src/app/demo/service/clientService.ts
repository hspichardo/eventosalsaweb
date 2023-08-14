import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Client } from '../interfaces/client';
import { Observable, Observer } from 'rxjs';
import { ResponseData } from '../interfaces/ResponseData';


@Injectable()
export class ClientsService {

    constructor(private http: HttpClient) { }


    getClients(): Observable<ResponseData> {
        return this.http.get<ResponseData>('http://localhost:3000/client');
    }

    getClient(client: Client): Observable<ResponseData> {
        return this.http.get<ResponseData>('http://localhost:3000/client/'+ client.id);
    }

    deleteClient(client: Client): Observable<ResponseData>  {
        return this.http.delete<ResponseData>('http://localhost:3000/client/' + client.id)
    }

    updateClient(client: Client): Observable<ResponseData> {
        return this.http.put<ResponseData>('http://localhost:3000/client', client)
    }

    newClient(client: Client): Observable<ResponseData> {
        return this.http.post<ResponseData>('http://localhost:3000/client', client)
    }


    deleteClients(clients: Client[]): number{
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

        for (let i = 0; i < clients.length; i++) {
            this.http.delete<ResponseData>('http://localhost:3000/client/'+ clients[i].id).subscribe(deleteObserver)
        }
        //TODO: list non deleted entity and report
        return 0;
    }


}
