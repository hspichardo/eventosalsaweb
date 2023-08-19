import {Component, OnInit} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {BreadcrumbService} from "../../app.breadcrumb.service";
import { Observer } from 'rxjs';
import { Table } from 'primeng/table';
import { ResponseData } from 'src/app/demo/interfaces/ResponseData';
import { formPersonService } from 'src/app/demo/service/formPersonService';
import { FormPerson } from 'src/app/demo/interfaces/formPerson';
import { Client } from 'src/app/demo/interfaces/client';
import { ClientsService } from 'src/app/demo/service/clientService';


@Component({
    templateUrl: './formPersons.component.html',
    providers: [MessageService, ConfirmationService],
    styleUrls: ['./formPersons.component.scss']
})
export class FormPersonComponent implements OnInit {

    formPersonDialog: boolean;

    deleteFormPersonsDialog: boolean = false;

    deleteFormPersonDialog: boolean = false;
    
    formPersons: FormPerson[];

    formPerson: FormPerson;

    selectedFormPersons: FormPerson[];

    submitted: boolean;

    cols: any[];

    selectedClientEntity: Client;

    clientEntities: Client[];


    rowsPerPageOptions = [5, 10, 20];

    

    constructor(private messageService: MessageService,
                private breadcrumbService: BreadcrumbService,
                private FormPersonService: formPersonService,
                private clientsService:ClientsService) {

        this.breadcrumbService.setItems([
            {label: 'Formulario de Personas'}
        ]);

    }
    
    getFormPersonsObserver: Observer<any> = {
        next: (response: ResponseData) => {  
            console.log(response)
            this.formPersons = response.data
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


        this.clientsService.getClients().subscribe(getClientsObserver);


        
        
        this.cols = [
			{ field: 'id', header: 'Id' },
			{ field: 'person', header: 'Persona' },
			{ field: 'counter', header: 'Contador' },
			{ field: 'benefit', header: 'Beneficio' },
            { field: 'actions', header: 'Acciones' }
        ];

    }

    openNew() {
        this.submitted = false;
        this.formPerson = {};
        this.formPersonDialog = true;
    }

    deleteSelectedFormPersons() {
        this.deleteFormPersonsDialog = true;
    }


    editFormPerson(formPerson: FormPerson) {
        this.formPerson = { ...formPerson };
        this.formPersonDialog = true;
    }


    deleteFormPerson(formPerson: FormPerson) {
        this.deleteFormPersonDialog = true;
        this.formPerson = { ...formPerson };
    }

    confirmDeleteSelected() {
        this.deleteFormPersonsDialog = false;
        this.formPersons = this.formPersons.filter(formPerson => !this.selectedFormPersons.includes(formPerson));
        if ( this.FormPersonService.deleteFormPersons(this.selectedFormPersons) == 0 ){
            this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Formulario de Personas eliminados', life: 3000 });
        }
        else{
            console.error("no se pudieron eliminar los Formulario de Personas seleccionados")
        }
        this.selectedFormPersons = [];
    }

    /**
     * Use FormPersonService to delete this.formPerson assign on deletFormPerson method
     */
    confirmDelete() {
        const deleteFormPersonObserver: Observer<any> = {
            next: (value: string) => {
                // Update formPerson array to refresh table
                this.formPersons = this.formPersons.filter(val => val.id !== this.formPerson.id);
                // UI successful message
                this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Entidad eliminado', life: 3000 });
            },
            error: (error: any) => {
                console.error(error);
                return 1;
            },
            complete: () => {
                // Hide formPerson dialog
                this.deleteFormPersonDialog = false;
                return 0;
            }
        };

        this.FormPersonService.deleteFormPerson(this.formPerson).subscribe(deleteFormPersonObserver)
    }

    hideDialog() {
        this.formPersonDialog = false;
        this.submitted = false;
    }

    /**
     * Use FormPersonService.updateFormPerson tu update/create a formPerson
     */
    saveFormPerson() {
        this.submitted = true;

        const saveFormPersonObserver: Observer<any> = {
            next: (response: ResponseData) => {
                // Update FormPersons array to refresh table
                const newFormPerson: FormPerson = response.data;
                const oldFormPersonIndex = this.formPersons.findIndex(r => r.id == newFormPerson.id);
                if (oldFormPersonIndex != -1)  {
                    this.formPersons[oldFormPersonIndex] = newFormPerson
                }
                else {
                    this.formPersons = [...this.formPersons, newFormPerson]
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
                // Hide new formPerson dialog
                this.formPersonDialog = false;
                this.formPerson = {};
                return 0;
            }
        };

        if (this.formPerson.counter) {
            if (this.formPerson.id) {
                this.FormPersonService.updateFormPerson(this.formPerson).subscribe(saveFormPersonObserver)
            }
            else {
                this.FormPersonService.newFormPerson(this.formPerson).subscribe(saveFormPersonObserver)
            }
        }

    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    updateFormTable(event) {
        // this.formPerson.client = event.value
        this.FormPersonService.getFormPersons().subscribe(this.getFormPersonsObserver);
        // this.ClientAccreditationService.getClientAccreditationByClient(this.clientAccreditation.client).subscribe(this.getClientAccreditationsObserver);
    }
}
