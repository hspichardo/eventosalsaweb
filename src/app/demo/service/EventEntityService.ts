import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EventEntity } from '../interfaces/eventEntity';
import { Observable, Observer } from 'rxjs';
import { ResponseData } from '../interfaces/ResponseData';


@Injectable()
export class EventEntitiesService {

    constructor(private http: HttpClient) { }


    getEventEntities(): Observable<ResponseData> {
        return this.http.get<ResponseData>('http://localhost:3000/events');
    }

    getEventEntity(event: EventEntity): Observable<ResponseData> {
        return this.http.get<ResponseData>('http://localhost:3000/events/'+ event.id);
    }

    deleteEventEntity(event: EventEntity): Observable<ResponseData>  {
        return this.http.delete<ResponseData>('http://localhost:3000/events/' + event.id)
    }

    updateEventEntity(event: EventEntity): Observable<ResponseData> {
        return this.http.put<ResponseData>('http://localhost:3000/events', event)
    }

    newEventEntity(event: EventEntity): Observable<ResponseData> {
        return this.http.post<ResponseData>('http://localhost:3000/events', event)
    }


    deleteEventEntities(events: EventEntity[]): number{
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

        for (let i = 0; i < events.length; i++) {
            this.http.delete<ResponseData>('http://localhost:3000/events/'+ events[i].id).subscribe(deleteObserver)
        }
        //TODO: list non deleted entity and report
        return 0;
    }


}
