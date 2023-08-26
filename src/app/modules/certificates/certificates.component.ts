import {Component, OnInit} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {BreadcrumbService} from "../../app.breadcrumb.service";
import { Observer } from 'rxjs';
import { Table } from 'primeng/table';
import { ResponseData } from 'src/app/demo/interfaces/ResponseData';
import { certificateService } from 'src/app/demo/service/certificateService';
import { Certificate } from 'src/app/demo/interfaces/certificate';


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

    certificate: Certificate;

    selectedCertificates: Certificate[];

    submitted: boolean;

    cols: any[];


    rowsPerPageOptions = [5, 10, 20];

    

    constructor(private messageService: MessageService,
                private breadcrumbService: BreadcrumbService,
                private CertificateService: certificateService) {

        this.breadcrumbService.setItems([
            {label: 'Certificados'}
        ]);

    }
  
    ngOnInit() {


        const getCertificatesObserver: Observer<any> = {
            next: (response: ResponseData) => { 
                if(response.status) 
                {
                    this.certificates = response.data
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

        this.CertificateService.getCertificates().subscribe(getCertificatesObserver);
        
        
        this.cols = [
			{ field: 'id', header: 'Id' },
			{ field: 'Person', header: 'Persona' },
			{ field: 'Benefit', header: 'Beneficio' },
            { field: 'actions', header: 'Acciones' }
        ];

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
                return 0;
            }
        };

        if (this.certificate.id) {
            this.CertificateService.updateCertificate(this.certificate).subscribe(saveCertificateObserver)
        }
        else {
            this.CertificateService.newCertificate(this.certificate).subscribe(saveCertificateObserver)
        }

    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
