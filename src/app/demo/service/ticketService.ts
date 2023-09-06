import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Ticket } from '../interfaces/ticket';
import { Observable, Observer } from 'rxjs';
import { ResponseData } from '../interfaces/ResponseData';
import { Person } from '../interfaces/person';


@Injectable()
export class TicketsService {

    constructor(private http: HttpClient) { }


    getTickets(): Observable<ResponseData> {
        return this.http.get<ResponseData>('https://api.hpichardotesting.com/ticket');
    }

    getTicket(event: Ticket): Observable<ResponseData> {
        return this.http.get<ResponseData>('https://api.hpichardotesting.com/ticket/'+ event.id);
    }

    getTicketByPersonId(person: Person): Observable<ResponseData> {
        return this.http.get<ResponseData>('https://api.hpichardotesting.com/ticket/person/'+ person.id);
    }

    deleteTicket(event: Ticket): Observable<ResponseData>  {
        return this.http.delete<ResponseData>('https://api.hpichardotesting.com/ticket/' + event.id)
    }

    updateTicket(event: Ticket): Observable<ResponseData> {
        return this.http.put<ResponseData>('https://api.hpichardotesting.com/ticket', event)
    }

    newTicket(event: Ticket): Observable<ResponseData> {
        return this.http.post<ResponseData>('https://api.hpichardotesting.com/ticket', event)
    }


    deleteTickets(tickets: Ticket[]): number{
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

        for (let i = 0; i < tickets.length; i++) {
            this.http.delete<ResponseData>('https://api.hpichardotesting.com/ticket/'+ tickets[i].id).subscribe(deleteObserver)
        }
        //TODO: list non deleted entity and report
        return 0;
    }


}
