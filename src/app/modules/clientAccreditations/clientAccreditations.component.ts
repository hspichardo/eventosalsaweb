import {Component, OnInit} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {BreadcrumbService} from "../../app.breadcrumb.service";
import { Observer } from 'rxjs';
import { Table } from 'primeng/table';
import { ResponseData } from 'src/app/demo/interfaces/ResponseData';
import { clientAccreditationService } from 'src/app/demo/service/clientAccreditationService';
import { ClientAccreditation } from 'src/app/demo/interfaces/clientAccreditation';


@Component({
    templateUrl: './clientAccreditations.component.html',
    providers: [MessageService, ConfirmationService],
    styleUrls: ['./clientAccreditations.component.scss']
})
export class ClientAccreditationComponent implements OnInit {

    clientAccreditationDialog: boolean;

    deleteClientAccreditationsDialog: boolean = false;

    deleteClientAccreditationDialog: boolean = false;
    
    clientAccreditations: ClientAccreditation[];

    clientAccreditation: ClientAccreditation;

    selectedClientAccreditations: ClientAccreditation[];

    submitted: boolean;

    cols: any[];


    rowsPerPageOptions = [5, 10, 20];

    

    constructor(private messageService: MessageService,
                private breadcrumbService: BreadcrumbService,
                private ClientAccreditationService: clientAccreditationService) {

        this.breadcrumbService.setItems([
            {label: 'Acreditación relacionada'}
        ]);

    }
  
    ngOnInit() {


        const getClientAccreditationsObserver: Observer<any> = {
            next: (response: ResponseData) => {  
                this.clientAccreditations = response.data
            },
            error: (error: any) => {
                console.error(error);
                return 1;
            },
            complete: () => {
                return 0;
            }
        };

        this.ClientAccreditationService.getClientAccreditations().subscribe(getClientAccreditationsObserver);
        
        
        this.cols = [
			{ field: 'id', header: 'id' },
			{ field: 'quantity', header: 'Cantidad' },
			{ field: 'client', header: 'Cliente' },
			{ field: 'accreditation', header: 'Acreditación' },
            { field: 'actions', header: 'Acciones' }
        ];

    }

    openNew() {
        this.submitted = false;
        this.clientAccreditation = {};
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
            this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Acreditación relacionada eliminados', life: 3000 });
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
                this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'accion completada', life: 3000 });
            },
            error: (error: any) => {
                console.error(error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: error, life: 3000 });
                return 1;
            },
            complete: () => {
                // Hide new clientAccreditation dialog
                this.clientAccreditationDialog = false;
                this.clientAccreditation = {};
                return 0;
            }
        };

        if (this.clientAccreditation.quantity) {
            if (this.clientAccreditation.id) {
                this.ClientAccreditationService.updateClientAccreditation(this.clientAccreditation).subscribe(saveClientAccreditationObserver)
            }
            else {
                this.ClientAccreditationService.newClientAccreditation(this.clientAccreditation).subscribe(saveClientAccreditationObserver)
            }
        }

    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
