import {Component, OnInit} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {BreadcrumbService} from "../../app.breadcrumb.service";
import { Observer } from 'rxjs';
import { Table } from 'primeng/table';
import { ResponseData } from 'src/app/demo/interfaces/ResponseData';
import { ClientsService } from 'src/app/demo/service/clientService';
import { Client } from 'src/app/demo/interfaces/client';


@Component({
    templateUrl: './client.component.html',
    providers: [MessageService, ConfirmationService],
    styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {

    entityDialog: boolean;

    deleteEntitiesDialog: boolean = false;

    deleteEntityDialog: boolean = false;
    
    deleteEventDialog: boolean = false;

    clients: Client[];

    client: Client;

    selectedEntities: Client[];

    submitted: boolean;

    cols: any[];


    rowsPerPageOptions = [5, 10, 20];

    

    constructor(private messageService: MessageService,
                private breadcrumbService: BreadcrumbService,
                private clientService: ClientsService) {

        this.breadcrumbService.setItems([
            {label: 'Clientes'}
        ]);

    }
  
    ngOnInit() {


        const getEntitiesObserver: Observer<any> = {
            next: (response: ResponseData) => {  
                this.clients = response.data
            },
            error: (error: any) => {
                console.error(error);
                return 1;
            },
            complete: () => {
                return 0;
            }
        };

        this.clientService.getClients().subscribe(getEntitiesObserver);
        
        
        this.cols = [
            { field: 'names', header: 'Nombres' },
            { field: 'identification', header: 'Identificación' },
            { field: 'actions', header: 'Acciones' },
        ];

    }

    openNew() {
        this.submitted = false;
        this.client = {};
        this.entityDialog = true;
    }

    deleteSelectedEntities() {
        this.deleteEntitiesDialog = true;
    }


    editEntity(event: Client) {
        this.client = { ...event };
        this.entityDialog = true;
    }


    deleteEntity(event: Client) {
        this.deleteEntityDialog = true;
        this.client = { ...event };
    }

    confirmDeleteSelected() {
        this.deleteEntitiesDialog = false;
        this.clients = this.clients.filter(event => !this.selectedEntities.includes(event));
        if ( this.clientService.deleteClients(this.selectedEntities) == 0 ){
            this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Clientes eliminados', life: 3000 });
        }
        else{
            console.error("no se pudieron eliminar los eventos seleccionados")
        }
        this.selectedEntities = [];
    }

    /**
     * Use clientService to delete this.event assign on deletClient method
     */
    confirmDelete() {
        const deleteEntityObserver: Observer<any> = {
            next: (value: string) => {
                // Update event array to refresh table
                this.clients = this.clients.filter(val => val.id !== this.client.id);
                // UI successful message
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Cliente eliminado', life: 3000 });
            },
            error: (error: any) => {
                console.error(error);
                return 1;
            },
            complete: () => {
                // Hide entity dialog
                this.deleteEntityDialog = false;
                return 0;
            }
        };

        this.clientService.deleteClient(this.client).subscribe(deleteEntityObserver)
    }

    hideDialog() {
        this.entityDialog = false;
        this.submitted = false;
    }

    /**
     * Use clientService.updateEntity tu update/create a event
     */
    saveEntity() {
        this.submitted = true;

        const saveEntityObserver: Observer<any> = {
            next: (response: ResponseData) => {
                // Update event array to refresh table
                const newClient: Client = response.data;
                const oldClientIndex = this.clients.findIndex(r => r.id == newClient.id);
                if (oldClientIndex != -1)  {
                    this.clients[oldClientIndex] = newClient
                }
                else {
                    this.clients = [...this.clients, newClient]
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
                // Hide new entity dialog
                this.entityDialog = false;
                this.client = {};
                return 0;
            }
        };

        if (this.client.identification?.trim()) {
            if (this.client.id) {
                this.clientService.updateClient(this.client).subscribe(saveEntityObserver)
            }
            else {
                this.clientService.newClient(this.client).subscribe(saveEntityObserver)
            }
        }

    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
