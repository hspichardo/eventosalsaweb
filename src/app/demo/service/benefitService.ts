import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, Observer } from 'rxjs';
import { ResponseData } from '../interfaces/ResponseData';
import { Benefit } from '../interfaces/benefit';


@Injectable()
export class BenefitService {

    constructor(private http: HttpClient) { }


    getBenefits(): Observable<ResponseData> {
        return this.http.get<ResponseData>(environment.apiUrl + '/benefits');
    }

    getBenefit(benefit: Benefit): Observable<ResponseData> {
        return this.http.get<ResponseData>(environment.apiUrl + '/benefits/'+ benefit.id);
    }

    deleteBenefit(benefit: Benefit): Observable<ResponseData>  {
        return this.http.delete<ResponseData>(environment.apiUrl + '/benefits/' + benefit.id)
    }

    updateBenefit(benefit: Benefit): Observable<ResponseData> {
        return this.http.put<ResponseData>(environment.apiUrl + '/benefits', benefit)
    }

    newBenefit(benefit: Benefit): Observable<ResponseData> {
        return this.http.post<ResponseData>(environment.apiUrl + '/benefits', benefit)
    }


    deleteBenefits(benefits: Benefit[]): number{
        const deleteObserver : Observer<any> = {
            next: (value: any) => {
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

        for (let i = 0; i < benefits.length; i++) {
            this.http.delete<ResponseData>(environment.apiUrl + '/benefits/' + benefits[i].id).subscribe(deleteObserver)
        }
        return 0;
    }


}
