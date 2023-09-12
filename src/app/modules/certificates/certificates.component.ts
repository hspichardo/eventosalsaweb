import {Component, OnInit} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {BreadcrumbService} from "../../app.breadcrumb.service";
import { Observer } from 'rxjs';
import { Table } from 'primeng/table';
import { ResponseData } from 'src/app/demo/interfaces/ResponseData';
import { certificateService } from 'src/app/demo/service/certificateService';
import { Certificate } from 'src/app/demo/interfaces/certificate';
import { Benefit } from 'src/app/demo/interfaces/benefit';
import { BenefitService } from 'src/app/demo/service/benefitService';
import { Person } from 'src/app/demo/interfaces/person';
import { PersonService } from 'src/app/demo/service/personService';


@Component({
    templateUrl: './certificates.component.html',
    providers: [MessageService, ConfirmationService],
    styleUrls: ['./certificates.component.scss']
})
export class CertificateComponent implements OnInit {

    certificateDialog: boolean;

    deleteCertificatesDialog: boolean = false;

    deleteCertificateDialog: boolean = false;
    
    certificates: Certificate[];
    benefits: Benefit[];
    people: Person[];


    certificate: Certificate;

    selectedCertificates: Certificate[];

    submitted: boolean;

    cols: any[];


    rowsPerPageOptions = [5, 10, 20];

    

    constructor(private messageService: MessageService,
                private breadcrumbService: BreadcrumbService,
                private CertificateService: certificateService,
                private benefitService: BenefitService,
                private personService: PersonService) {

        this.breadcrumbService.setItems([
            {label: 'Certificados'}
        ]);

    }
    getPeopleObserver: Observer<any> = {
        next: (response: ResponseData) => { 
            if(response.status) 
            {
                this.people = response.data
                this.filterPeopleWithCertificate()
            }
            else
            {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message, life: 3000 });
                console.log(response.message);
            } 
        },
        error: (error: any) => {
            console.error(error);
            return 1;
        },
        complete: () => {
            return 0;
        }
    };

  
    ngOnInit() {


        const getCertificatesObserver: Observer<any> = {
            next: (response: ResponseData) => { 
                if(response.status) 
                {
                    this.certificates = response.data;
                    this.certificates.forEach(certificate => {
                        if (certificate.benefit == null)
                        {
                            certificate.benefit = {description:'description'}
                        }
                        if (certificate.person == null)
                        {
                            certificate.person = {names:'names'}
                        }

                    });

                }
                else
                {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message, life: 3000 });
                    console.log(response.message);
                }
            },
            error: (error: any) => {
                console.error(error);
                return 1;
            },
            complete: () => {
                this.personService.getPeople().subscribe(this.getPeopleObserver);
                return 0;
            }
        };

        const getBenefitsObserver: Observer<any> = {
            next: (response: ResponseData) => {  
                if(response.status) 
                {
                    this.benefits = response.data
                    this.benefits = this.benefits.filter( benefit => benefit.generate_certificate)
                }
                else
                {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message, life: 3000 });
                    console.log(response.message);
                }
            },
            error: (error: any) => {
                console.error(error);
                return 1;
            },
            complete: () => {
                return 0;
            }
        };



        this.benefitService.getBenefits().subscribe(getBenefitsObserver);
        this.CertificateService.getCertificates().subscribe(getCertificatesObserver);
        
        
        this.cols = [
			{ field: 'Person', header: 'Persona' },
			{ field: 'Benefit', header: 'Beneficio' },
            { field: 'actions', header: 'Acciones' }
        ];

    }

    filterPeopleWithCertificate()
    {
        const peopleIDWithCertificate = this.certificates? this.certificates.map( certificate => certificate.person.id) : []
        this.people = this.people.filter( person => ! peopleIDWithCertificate.includes(person.id))

    }

    openNew() {
        this.submitted = false;
        this.certificate = {};
        this.certificateDialog = true;
    }

    deleteSelectedCertificates() {
        this.deleteCertificatesDialog = true;
    }


    editCertificate(certificate: Certificate) {
        this.certificate = { ...certificate };
        this.certificateDialog = true;
    }


    deleteCertificate(certificate: Certificate) {
        this.deleteCertificateDialog = true;
        this.certificate = { ...certificate };
    }

    confirmDeleteSelected() {
        this.deleteCertificatesDialog = false;
        this.certificates = this.certificates.filter(certificate => !this.selectedCertificates.includes(certificate));
        if ( this.CertificateService.deleteCertificates(this.selectedCertificates) == 0 ){
            this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Certificados eliminados', life: 3000 });
        }
        else{
            console.error("no se pudieron eliminar los Certificados seleccionados")
        }
        this.selectedCertificates = [];
    }

    /**
     * Use CertificateService to delete this.certificate assign on deletCertificate method
     */
    confirmDelete() {
        const deleteCertificateObserver: Observer<any> = {
            next: (value: string) => {
                // Update certificate array to refresh table
                this.certificates = this.certificates.filter(val => val.id !== this.certificate.id);
                // UI successful message
                this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Entidad eliminado', life: 3000 });
            },
            error: (error: any) => {
                console.error(error);
                return 1;
            },
            complete: () => {
                // Hide certificate dialog
                this.deleteCertificateDialog = false;
                this.personService.getPeople().subscribe(this.getPeopleObserver);
                return 0;
            }
        };

        this.CertificateService.deleteCertificate(this.certificate).subscribe(deleteCertificateObserver)
    }

    hideDialog() {
        this.certificateDialog = false;
        this.submitted = false;
    }

    /**
     * Use CertificateService.updateCertificate tu update/create a certificate
     */
    saveCertificate() {
        this.submitted = true;

        const saveCertificateObserver: Observer<any> = {
            next: (response: ResponseData) => {
                // Update Certificates array to refresh table
                const newCertificate: Certificate = response.data;
                const oldCertificateIndex = this.certificates.findIndex(r => r.id == newCertificate.id);
                if (oldCertificateIndex != -1)  {
                    this.certificates[oldCertificateIndex] = newCertificate
                }
                else {
                    this.certificates = [...this.certificates, newCertificate]
                }
                // UI successful message
                this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'accion completada', life: 3000 });
            },
            error: (error: any) => {
                console.error(error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: error, life: 3000 });
                return 1;
            },
            complete: () => {
                // Hide new certificate dialog
                this.certificateDialog = false;
                this.certificate = {};
                this.personService.getPeople().subscribe(this.getPeopleObserver);
                return 0;
            }
        };

        if (this.certificate.person && this.certificate.benefit)
        {
            if (this.certificate.id) {
                this.CertificateService.updateCertificate(this.certificate).subscribe(saveCertificateObserver)
            }
            else {
                this.CertificateService.newCertificate(this.certificate).subscribe(saveCertificateObserver)
            }

        }

    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
