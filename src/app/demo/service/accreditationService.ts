import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, Observer } from 'rxjs';
import { ResponseData } from '../interfaces/ResponseData';
import { Accreditation } from '../interfaces/accreditation';
import { EventEntity } from '../interfaces/eventEntity';


@Injectable()
export class AccreditationService {

    constructor(private http: HttpClient) { }


    getAccreditations(): Observable<ResponseData> {
        return this.http.get<ResponseData>(environment.apiUrl + '/accreditations');
    }

    getAccreditation(acreditation: Accreditation): Observable<ResponseData> {
        return this.http.get<ResponseData>(environment.apiUrl + '/accreditations/'+ acreditation.id);
    }

    getAccreditationsByEventId(event: EventEntity): Observable<ResponseData> {
        return this.http.get<ResponseData>(environment.apiUrl + '/accreditations/by_event/'+event.id);
    }

    deleteAccreditation(acreditation: Accreditation): Observable<ResponseData>  {
        return this.http.delete<ResponseData>(environment.apiUrl + '/accreditations/' + acreditation.id);
    }

    updateAccreditation(acreditation: Accreditation): Observable<ResponseData> {
        let body: Object = {...acreditation};
        delete body['event'];
        if( body['benefits'] ){
            body['benefits'] = body['benefits'].map(benefit => benefit.id);
        }
        else {
            delete body['benefits'];
        }
        return this.http.put<ResponseData>(environment.apiUrl + '/accreditations/', body)
    }

    newAccreditation(acreditation: Accreditation): Observable<ResponseData> {
        let body: Object = {...acreditation};
        body['event'] = body['event'].id;
        body['benefits'] = body['benefits']? body['benefits'].map(benefit => benefit.id):[];
        return this.http.post<ResponseData>(environment.apiUrl + '/accreditations', body)
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
            this.http.delete<ResponseData>(environment.apiUrl + '/accreditations/' + accreditations[i].id).subscribe(deleteObserver)
        }
        return 0;
    }


}
