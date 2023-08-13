import {Component, OnInit} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {BreadcrumbService} from "../../app.breadcrumb.service";
import { Observer } from 'rxjs';
import { Table } from 'primeng/table';
import { ResponseData } from 'src/app/demo/interfaces/ResponseData';
import { AccreditationService } from 'src/app/demo/service/accreditationService';
import { Accreditation } from 'src/app/demo/interfaces/accreditation';
import { EventEntity } from 'src/app/demo/interfaces/eventEntity';
import { EventEntitiesService } from 'src/app/demo/service/EventEntityService';


@Component({
    templateUrl: './accreditations.component.html',
    providers: [MessageService, ConfirmationService, EventEntitiesService],
    styleUrls: ['./accreditations.component.scss']
})
export class AccreditationComponent implements OnInit {

    entityDialog: boolean;

    deleteEntitiesDialog: boolean = false;

    deleteEventDialog: boolean = false;

    accreditations: Accreditation[];

    accreditation: Accreditation;

    selectedEntities: Accreditation[];

    submitted: boolean;

    cols: any[];

    eventEntities: EventEntity[];
    
    selectedeventEntity: EventEntity;


    rowsPerPageOptions = [5, 10, 20];

    

    constructor(private messageService: MessageService,
                private breadcrumbService: BreadcrumbService,
                private accreditationService: AccreditationService,
                private eventEntityService: EventEntitiesService) {

        this.breadcrumbService.setItems([
            {label: 'Eventos'}
        ]);

    }
  
    ngOnInit() {


        const getEntitiesObserver: Observer<any> = {
            next: (response: ResponseData) => {  
                this.accreditations = response.data
            },
            error: (error: any) => {
                console.error(error);
                return 1;
            },
            complete: () => {
                return 0;
            }
        };

        const getEventEntitiesObserver: Observer<any> = {
            next: (response: ResponseData) => {  
                this.eventEntities = response.data
            },
            error: (error: any) => {
                console.error(error);
                return 1;
            },
            complete: () => {
                return 0;
            }
        };

        this.eventEntityService.getEventEntities().subscribe(getEventEntitiesObserver);
        // this.accreditationService.getAccreditations().subscribe(getEntitiesObserver);
        this.accreditations = new Array<Accreditation>();
        
        
        this.cols = [
            { field: 'id', header: 'Id' },
            { field: 'description', header: 'Descripción' },
            { field: 'actions', header: 'Acciones' },
        ];

    }

    openNew() {
        this.submitted = false;
        this.accreditation = {};
        this.entityDialog = true;
    }

    private getEntitiesObserver: Observer<any> = {
        next: (response: ResponseData) => {  
            this.accreditations = response.data
        },
        error: (error: any) => {
            console.error(error);
            return 1;
        },
        complete: () => {
            return 0;
        }
    };

    deleteSelectedEntities() {
        this.deleteEntitiesDialog = true;
    }


    editEntity(event: Accreditation) {
        this.accreditation = { ...event };
        this.entityDialog = true;
    }


    deleteEntity(event: Accreditation) {
        this.deleteEntitiesDialog = true;
        this.accreditation = { ...event };
    }

    confirmDeleteSelected() {
        this.deleteEntitiesDialog = false;
        this.accreditations = this.accreditations.filter(event => !this.selectedEntities.includes(event));
        if ( this.accreditationService.deleteAccreditations(this.selectedEntities) == 0 ){
            this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Eventos eliminados', life: 3000 });
        }
        else{
            console.error("no se pudieron eliminar los eventos seleccionados")
        }
        this.selectedEntities = [];
    }

    /**
     * Use accreditationService to delete this.event assign on deletAccreditation method
     */
    confirmDelete() {
        const deleteEntityObserver: Observer<any> = {
            next: (value: string) => {
                // Update event array to refresh table
                this.accreditations = this.accreditations.filter(val => val.id !== this.accreditation.id);
                // UI successful message
                this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Rol eliminado', life: 3000 });
            },
            error: (error: any) => {
                console.error(error);
                return 1;
            },
            complete: () => {
                // Hide entity dialog
                this.deleteEntitiesDialog = false;
                return 0;
            }
        };

        this.accreditationService.deleteAccreditation(this.accreditation).subscribe(deleteEntityObserver)
    }

    hideDialog() {
        this.entityDialog = false;
        this.submitted = false;
    }

    /**
     * Use accreditationService.updateEntity tu update/create a event
     */
    saveEntity() {
        this.submitted = true;

        const saveEntityObserver: Observer<any> = {
            next: (event: any) => {
                // Update event array to refresh table
                const oldAccreditationIndex = this.accreditations.findIndex(r => r.id == event.id);
                const newAccreditation: Accreditation = event;
                if (oldAccreditationIndex != -1)  {
                    this.accreditations[oldAccreditationIndex] = newAccreditation
                }
                else {
                    this.accreditations = [...this.accreditations, newAccreditation]
                }
                // UI successful message
                this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'accion completada', life: 3000 });
            },
            error: (error: any) => {
                console.error(error);
                return 1;
            },
            complete: () => {
                // Hide new entity dialog
                this.entityDialog = false;
                this.accreditation = {};
                return 0;
            }
        };

        if (this.accreditation.description?.trim()) {
            if (this.accreditation.id) {
                // this.accreditationService.updateEntity(this.accreditation).subscribe(saveEntityObserver)
            }
            else {
                this.accreditationService.newAccreditation(this.accreditation).subscribe(saveEntityObserver)
            }
        }

    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    
    updateAcredatitionTable(event) {
        let eventSelected: EventEntity = event.value;
        this.accreditationService.getAccreditationsByEventId(eventSelected).subscribe(this.getEntitiesObserver);
    }
}
