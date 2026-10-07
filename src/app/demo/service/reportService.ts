import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { ResponseData } from '../interfaces/ResponseData';


@Injectable()
export class ReportService {

    constructor(private http: HttpClient) { }

    getReportByEvent(eventId: number): Observable<ResponseData> {
        return this.http.get<ResponseData>(environment.apiUrl + '/report/event/' + eventId);
    }

}
