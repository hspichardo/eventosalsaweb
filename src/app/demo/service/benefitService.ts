import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { ResponseData } from '../interfaces/ResponseData';
import { Benefit } from '../interfaces/benefit';


@Injectable()
export class BenefitService {

    constructor(private http: HttpClient) { }


    getBenefits(): Observable<ResponseData> {
        return this.http.get<ResponseData>('http://localhost:3000/benefits');
    }

    getBenefit(benefit: Benefit): Observable<ResponseData> {
        return this.http.get<ResponseData>('http://localhost:3000/benefits/'+ benefit.id);
    }

    deleteBenefit(benefit: Benefit): Observable<ResponseData>  {
        return this.http.delete<ResponseData>('http://localhost:3000/benefits/' + benefit.id)
    }

    updateBenefit(benefit: Benefit): Observable<ResponseData> {
        return this.http.put<ResponseData>('http://localhost:3000/benefits/update/', benefit)
    }

    newBenefit(benefit: Benefit): Observable<ResponseData> {
        return this.http.post<ResponseData>('http://localhost:3000/benefits', benefit)
    }


    deleteBenefits(benefits: Benefit[]): number{
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

        for (let i = 0; i < benefits.length; i++) {
            this.http.delete<any>('https://6492e75a428c3d2035d0df8b.mockapi.io/mockapi/rol/' + benefits[i].id).subscribe(deleteObserver)
        }
        return 0;
    }


}
