import {Component, OnInit} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {BreadcrumbService} from "../../app.breadcrumb.service";
import { Observer } from 'rxjs';
import { Table } from 'primeng/table';
import { ResponseData } from 'src/app/demo/interfaces/ResponseData';
import { clientAccreditationService } from 'src/app/demo/service/clientAccreditationService';
import { ClientAccreditation } from 'src/app/demo/interfaces/clientAccreditation';
import { Client } from 'src/app/demo/interfaces/client';
import { ClientsService } from 'src/app/demo/service/clientService';
import { Accreditation } from 'src/app/demo/interfaces/accreditation';
import { AccreditationService } from 'src/app/demo/service/accreditationService';


@Component({
    templateUrl: './clientAccreditations.component.html',
    providers: [MessageService, ConfirmationService],
    styleUrls: ['./clientAccreditations.component.scss']
})
export class ClientAccreditationComponent implements OnInit {

    clientAccreditationDialog: boolean;

    deleteClientAccreditationsDialog: boolean = false;

    deleteClientAccreditationDialog: boolean = false;

    accreditationEntities: Accreditation[];
    
    clientAccreditations: ClientAccreditation[];

    clientAccreditation: ClientAccreditation;

    selectedClientAccreditations: ClientAccreditation[];

    selectedClientEntity: Client;

    clientEntities: Client[];

    selectedAccreditationEntity: Accreditation;

    submitted: boolean;

    cols: any[];


    rowsPerPageOptions = [5, 10, 20];

    

    constructor(private messageService: MessageService,
                private breadcrumbService: BreadcrumbService,
                private ClientAccreditationService: clientAccreditationService,
                private clientsService: ClientsService,
                private accreditationService: AccreditationService) {

        this.breadcrumbService.setItems([
            {label: 'Acreditación relacionada'}
        ]);

    }
  
    getClientAccreditationsObserver: Observer<any> = {
        next: (response: ResponseData) => { 
            if(response.status)
            {   this.clientAccreditations = []
                this.clientAccreditations.push( response.data)
            }
            else
            {
                console.log(response)
                this.messageService.add({ severity: 'info', summary: 'Info', detail: "El usuario no posee acreditaciones", life: 3000 });
                // this.messageService.add({ severity: 'error', summary: 'error', detail: response.message, life: 3000 });
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
        this.clientAccreditation = {};
        this.clientAccreditations = []
        this.accreditationEntities = [];

        const getClientsObserver: Observer<any> = {
            next: (response: ResponseData) => {  
                this.clientEntities = response.data
            },
            error: (error: any) => {
                console.error(error);
                return 1;
            },
            complete: () => {
                return 0;
            }
        };

        const getAccreditationsObserver: Observer<any> = {
            next: (response: ResponseData) => {  
                this.accreditationEntities = response.data
            },
            error: (error: any) => {
                console.error(error);
                return 1;
            },
            complete: () => {
                return 0;
            }
        };

        // this.ClientAccreditationService.getClientAccreditations().subscribe(getClientAccreditationsObserver);
        this.clientsService.getClients().subscribe(getClientsObserver);
        this.accreditationService.getAccreditations().subscribe(getAccreditationsObserver);

        
        
        this.cols = [
			{ field: 'accreditation', header: 'Acreditación' },
			{ field: 'quantity', header: 'Cantidad' },
            { field: 'actions', header: 'Acciones' }
        ];

    }

    openNew() {
        this.submitted = false;
        this.clientAccreditation.quantity = 1;
        this.clientAccreditationDialog = true;
    }

    deleteSelectedClientAccreditations() {
        this.deleteClientAccreditationsDialog = true;
    }


    editClientAccreditation(clientAccreditation: ClientAccreditation) {
        this.clientAccreditation = { ...clientAccreditation };
        this.clientAccreditationDialog = true;
    }


    deleteClientAccreditation(clientAccreditation: ClientAccreditation) {
        this.deleteClientAccreditationDialog = true;
        this.clientAccreditation = { ...clientAccreditation };
    }

    confirmDeleteSelected() {
        this.deleteClientAccreditationsDialog = false;
        this.clientAccreditations = this.clientAccreditations.filter(clientAccreditation => !this.selectedClientAccreditations.includes(clientAccreditation));

        if ( this.ClientAccreditationService.deleteClientAccreditations(this.selectedClientAccreditations) == 0 ){
            this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Acreditaciones eliminadas', life: 3000 });
        }
        else{
            console.error("no se pudieron eliminar los Acreditación relacionada seleccionados")
        }
        this.selectedClientAccreditations = [];
    }

    /**
     * Use ClientAccreditationService to delete this.clientAccreditation assign on deletClientAccreditation method
     */
    confirmDelete() {
        const deleteClientAccreditationObserver: Observer<any> = {
            next: (value: string) => {
                // Update clientAccreditation array to refresh table
                this.clientAccreditations = this.clientAccreditations.filter(val => val.id !== this.clientAccreditation.id);
                // UI successful message
                this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Entidad eliminado', life: 3000 });
            },
            error: (error: any) => {
                console.error(error);
                return 1;
            },
            complete: () => {
                // Hide clientAccreditation dialog
                this.deleteClientAccreditationDialog = false;
                this.clientAccreditation.accreditation = {};
                return 0;
            }
        };

        this.ClientAccreditationService.deleteClientAccreditation(this.clientAccreditation).subscribe(deleteClientAccreditationObserver)
    }

    hideDialog() {
        this.clientAccreditationDialog = false;
        this.submitted = false;
    }

    /**
     * Use ClientAccreditationService.updateClientAccreditation tu update/create a clientAccreditation
     */
    saveClientAccreditation() {
        this.submitted = true;

        const saveClientAccreditationObserver: Observer<any> = {
            next: (response: ResponseData) => {

                if(response.status)
                {
                    // Update ClientAccreditations array to refresh table
                    const newClientAccreditation: ClientAccreditation = response.data;
                    const oldClientAccreditationIndex = this.clientAccreditations.findIndex(r => r.id == newClientAccreditation.id);
                    if (oldClientAccreditationIndex != -1)  {
                        this.clientAccreditations[oldClientAccreditationIndex] = newClientAccreditation
                    }
                    else {
                        this.clientAccreditations = [...this.clientAccreditations, newClientAccreditation]
                    }
                    // UI successful message
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'accion completada', life: 3000 });
                }
                else
                {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message, life: 3000 });
                }

            },
            error: (error: any) => {
                console.error(error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: error, life: 3000 });
                return 1;
            },
            complete: () => {
                // Hide new clientAccreditation dialog
                this.clientAccreditationDialog = false;
                this.clientAccreditation.accreditation = {};
                return 0;
            }
        };

        if(this.clientAccreditation.accreditation)
        {
            
            this.ClientAccreditationService.newClientAccreditation(this.clientAccreditation).subscribe(saveClientAccreditationObserver)

            // if (this.clientAccreditation.id) {
            //     this.ClientAccreditationService.updateClientAccreditation(this.clientAccreditation).subscribe(saveClientAccreditationObserver)
            // }
            // else {
            //     this.ClientAccreditationService.newClientAccreditation(this.clientAccreditation).subscribe(saveClientAccreditationObserver)
            // }
        }

    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    //[(ngModel)] directive not working 
    updateClientAcreditationTable(event) {
        this.clientAccreditation.client = event.value
        this.ClientAccreditationService.getClientAccreditationByClient(this.clientAccreditation.client).subscribe(this.getClientAccreditationsObserver);
    }

    //[(ngModel)] directive not working 
    updateSelectedAcreditation(event) {
        this.clientAccreditation.accreditation = event.value
    }
}
