import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { ResponseData } from '../interfaces/ResponseData';
import { Accreditation } from '../interfaces/accreditation';
import { EventEntity } from '../interfaces/eventEntity';


@Injectable()
export class AccreditationService {

    constructor(private http: HttpClient) { }


    getAccreditations(): Observable<ResponseData> {
        return this.http.get<ResponseData>('http://localhost:3000/accreditations');
    }

    getAccreditation(event: Accreditation): Observable<ResponseData> {
        return this.http.get<ResponseData>('http://localhost:3000/accreditations/'+ event.id);
    }

    getAccreditationsByEventId(event: EventEntity): Observable<ResponseData> {
        return this.http.get<ResponseData>('http://localhost:3000/accreditations');
    }

    deleteAccreditation(event: Accreditation): Observable<ResponseData>  {
        return this.http.delete<ResponseData>('http://localhost:3000/accreditations/' + event.id)
    }

    updateAccreditation(event: Accreditation): Observable<ResponseData> {
        return this.http.put<ResponseData>('http://localhost:3000/accreditations/update/', event)
    }

    newAccreditation(event: Accreditation): Observable<ResponseData> {
        return this.http.post<ResponseData>('http://localhost:3000/accreditations', event)
    }


    deleteAccreditations(accreditations: Accreditation[]): number{
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

        for (let i = 0; i < accreditations.length; i++) {
            this.http.delete<any>('https://6492e75a428c3d2035d0df8b.mockapi.io/mockapi/rol/' + accreditations[i].id).subscribe(deleteObserver)
        }
        return 0;
    }


}
