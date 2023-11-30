import {Component, OnInit} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {BreadcrumbService} from "../../app.breadcrumb.service";
import { Observer } from 'rxjs';
import { Table } from 'primeng/table';
import { ResponseData } from 'src/app/demo/interfaces/ResponseData';
import { FormPersonService } from 'src/app/demo/service/formPersonService';
import { FormPerson } from 'src/app/demo/interfaces/formPerson';
import { Client } from 'src/app/demo/interfaces/client';
import { ClientsService } from 'src/app/demo/service/clientService';
import { clientAccreditationService } from 'src/app/demo/service/clientAccreditationService';
import { ClientAccreditation } from 'src/app/demo/interfaces/clientAccreditation';
import { Person } from 'src/app/demo/interfaces/person';
import { TicketsService } from 'src/app/demo/service/ticketService';
import { PersonService } from 'src/app/demo/service/personService';


@Component({
    templateUrl: './formPersons.component.html',
    providers: [MessageService, ConfirmationService],
    styleUrls: ['./formPersons.component.scss']
})
export class FormPersonComponent implements OnInit {

    peopleDialog: boolean = false;
    QRDialog: boolean = false;

    deleteFormPersonsDialog: boolean = false;
    deleteFormPersonDialog: boolean = false;
    deleteRegisteredPersonDialog: boolean = false;

    deletePeopleDialog: boolean = false;

    formPersons: FormPerson[];

    formPerson: FormPerson;

    selectedformPerson: FormPerson;

    selectedRegisteredPerson : Person;
    selectedRegisteredPeople : Person[];

    selectedFormPersons: FormPerson[];

    clientAccreditations: ClientAccreditation[];

    submitted: boolean;

    cols: any[];

    selectedClientEntity: Client;

    clientEntities: Client[];

    rowsPerPageOptions = [5, 10, 20];

    cols_registeredPeople = [];



    constructor(private messageService: MessageService,
                private breadcrumbService: BreadcrumbService,
                private FormPersonService: FormPersonService,
                private clientsService:ClientsService,
                private ClientAccreditationService: clientAccreditationService,
                private ticketsService: TicketsService,
                private personService: PersonService
                ) {

        this.breadcrumbService.setItems([
            {label: 'Formulario de Personas'}
        ]);

    }


    ngOnInit() {

        this.selectedRegisteredPerson = {names:''}

        this.cols_registeredPeople = [
            { field: 'description', header: 'Identificación' },
            { field: 'names', header: 'Nombres' },
            { field: 'surnames', header: 'Apellidos' },
            { field: 'phone_number', header: 'Celular' },
            { field: 'qr', header: 'Acciones' }
        ];


        this.clientAccreditations = [
            {formsGenerated:true}
        ];


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
			{ field: 'benefit', header: 'Beneficio' },
			{ field: 'counter', header: 'Cupos disponibles' },
            { field: 'actions', header: 'Acciones' }
        ];

    }

    openNew() {
        this.submitted = false;
        this.formPerson = {};
        this.peopleDialog = true;
    }

    openRegisteredPeople(formPerson: FormPerson) {
        this.selectedformPerson = formPerson;
        this.peopleDialog = true;
        this.updateRegisteredPeopleTable(formPerson);
    }

    deleteSelectedFormPersons() {
        this.deleteFormPersonsDialog = true;
    }


    editFormPerson(formPerson: FormPerson) {
        this.formPerson = { ...formPerson };
        this.peopleDialog = true;
    }


    deletePeople(formPerson: FormPerson) {
        this.deletePeopleDialog = true;
    }

    deleteRegisteredPerson(person: Person) {
        console.log(person)
        console.log(this.selectedRegisteredPerson)
        this.selectedRegisteredPerson = person;
        this.deleteRegisteredPersonDialog = true;
    }

    /**
     * Use FormPersonService to delete this.formPerson assign on deletFormPerson method
     */
    confirmDeletePerson() {
        const deleteFormPersonObserver: Observer<any> = {
            next: (value: string) => {
                // Update formPerson array to refresh table
                this.formPersons = this.formPersons.filter(val => val.id !== this.formPerson.id);
                // UI successful message
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Persona eliminada', life: 3000 });
            },
            error: (error: any) => {
                console.error(error);
                return 1;
            },
            complete: () => {
                // Hide formPerson dialog
                this.deletePeopleDialog = false;
                return 0;
            }
        };

        this.personService.deletePerson(this.selectedRegisteredPerson).subscribe(deleteFormPersonObserver)
    }


    confirmDeleteSelected() {
        this.deletePeopleDialog = false;
        this.selectedformPerson.people = this.selectedformPerson.people.filter(person => !this.selectedRegisteredPeople.includes(person)) as [];
        console.log(this.selectedformPerson.people)
        if ( this.personService.deletePeople(this.selectedRegisteredPeople) == 0 ){
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Personas eliminadas', life: 3000 });
        }
        else{
            console.error("no se pudieron eliminar los registros de Personas seleccionados")
        }
        this.selectedRegisteredPeople = [];
    }

    /**
     * Use FormPersonService to delete this.formPerson assign on deletFormPerson method
     */
    confirmDelete() {
        const deletePersonObserver: Observer<any> = {
            next: (value: string) => {
                // Update formPerson array to refresh table
                this.selectedformPerson.people = this.selectedformPerson.people.filter(val => val['id'] !== this.selectedRegisteredPerson.id) as [];

                // UI successful message
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'registro eliminado', life: 3000 });
            },
            error: (error: any) => {
                console.error(error);
                return 1;
            },
            complete: () => {
                this.deleteRegisteredPersonDialog = false;
                return 0;
            }
        };

        this.personService.deletePerson(this.selectedRegisteredPerson).subscribe(deletePersonObserver)
    }

    hideDialog() {
        this.peopleDialog = false;
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
                this.peopleDialog = false;
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

    generateModKey(formPerson : FormPerson)
    {
        formPerson.mod_key = formPerson.key.replaceAll('/','_slashslash_');
        return formPerson;
    }

    getClientFormsObserver: Observer<any> = {
        next: (response: ResponseData) => {
            console.log(response)
            if(response.status)
            {
                this.formPersons = response.data;
                this.formPersons.map((f) => this.generateModKey(f))
                this.formPersons.forEach((f) => f.people = [])
            }
            else
            {
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

    getClientAccreditationsObserver: Observer<any> = {
        next: (response: ResponseData) => {

            if(response.status)
            {
                this.clientAccreditations = []
                this.clientAccreditations.push( response.data)

                if (this.clientAccreditations[0].formsGenerated)
                {
                    this.FormPersonService.getFormPersonsByClientId(this.selectedClientEntity).subscribe(this.getClientFormsObserver)
                }
            }
            else
            {
                this.formPersons = [];
                this.clientAccreditations = [
                    {formsGenerated:true}
                ];
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

    getFormPersonObserver: Observer<any> = {
        next: (response: ResponseData) => {

            if(response.status)
            {
                const mod_key = this.selectedformPerson.mod_key;
                this.selectedformPerson = response.data;
                this.selectedformPerson.people = response.data.persons || []; // correction persons to people
                delete this.selectedformPerson['persons'] ; // correction persons to people
                this.selectedformPerson.mod_key = mod_key;
            }
            else
            {
                this.messageService.add({ severity: 'info', summary: 'Info', detail: response.message, life: 3000 });
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


    updateRegisteredPeopleTable(formPerson: FormPerson) {
        this.FormPersonService.getFormPerson(formPerson).subscribe(this.getFormPersonObserver)
    }

    updateFormTable(event) {
        this.selectedClientEntity = event.value
        console.log(this.selectedClientEntity   )
        this.ClientAccreditationService.getClientAccreditationByClient(this.selectedClientEntity).subscribe(this.getClientAccreditationsObserver);
    }

    generateForms() {
        this.messageService.add({ severity: 'info', summary: 'Info', detail: "Se están generando los formularios", life: 3000 });

        const generateFormsObserver: Observer<any> = {
            next: (response: ResponseData) => {
                console.log(response)
                if(response.status)
                {
                    this.formPersons = response.data;
                    this.formPersons.map((f) => this.generateModKey(f))
                    this.formPersons.forEach((f) => f.people = [])
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: "Formularios creados exitosamente", life: 3000 });
                }
                else
                {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message, life: 3000 });
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

        this.ClientAccreditationService.generateFormsByClient(this.selectedClientEntity).subscribe(generateFormsObserver);
    }

    copyFormLink(formPerson) {
        this.copyTextOnClipboard('https://eventosconsorcioexportworld.com//#/form/' + formPerson.mod_key)
    }

    copyTextOnClipboard = async (text: string): Promise<void> => {
        try {
            await navigator.clipboard.writeText(text);
            this.messageService.add({ severity: 'info', summary: 'Info', detail: "Link copiado en el portapapeles", life: 3000 });
        }
        catch (error) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "No se puedo copiar el link", life: 3000 });
        }
      }

    showQRCodes(person: Person)
    {
        this.QRDialog = true;
        this.selectedRegisteredPerson = person;


        const getTicketObserver: Observer<any> = {
            next: (response: ResponseData) => {
                if(response.status)
                {
                    this.selectedRegisteredPerson.ticket = response.data;
                }
                else
                {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message, life: 3000 });
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

        this.ticketsService.getTicketByPersonId(this.selectedRegisteredPerson).subscribe(getTicketObserver)

    }
}
