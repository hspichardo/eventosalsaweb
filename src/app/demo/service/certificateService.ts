
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Certificate } from '../interfaces/certificate';
import { Observable, Observer } from 'rxjs';
import { ResponseData } from '../interfaces/ResponseData';

@Injectable()
export class certificateService {

    constructor(private http: HttpClient) { }


    getCertificates(): Observable<ResponseData> {
        return this.http.get<ResponseData>('http://localhost:3000/certificate');
    }

    getCertificate(certificate: Certificate): Observable<ResponseData> {
        return this.http.get<ResponseData>('http://localhost:3000/certificate/'+ certificate.id);
    }

    deleteCertificate(certificate: Certificate): Observable<ResponseData>  {
        return this.http.delete<ResponseData>('http://localhost:3000/certificate/' + certificate.id)
    }

    updateCertificate(certificate: Certificate): Observable<ResponseData> {
        return this.http.put<ResponseData>('http://localhost:3000/certificate', certificate)
    }

    newCertificate(certificate: Certificate): Observable<ResponseData> {
        return this.http.post<ResponseData>('http://localhost:3000/certificate', certificate)
    }


    deleteCertificates(certificates: Certificate[]): number{
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

        for (let i = 0; i < certificates.length; i++) {
            this.http.delete<ResponseData>('http://localhost:3000/certificate/'+ certificates[i].id).subscribe(deleteObserver)
        }
        //TODO: list non deleted certificate and report
        return 0;
    }


}
