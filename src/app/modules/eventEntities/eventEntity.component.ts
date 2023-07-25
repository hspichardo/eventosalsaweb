import {Component, OnInit} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {BreadcrumbService} from "../../app.breadcrumb.service";
import { Observer } from 'rxjs';
import { Table } from 'primeng/table';
import { ResponseData } from 'src/app/demo/interfaces/ResponseData';
import { EventEntitiesService } from 'src/app/demo/service/EventEntityService';
import { EventEntity } from 'src/app/demo/interfaces/eventEntity';


@Component({
    templateUrl: './eventEntity.component.html',
    providers: [MessageService, ConfirmationService],
    styleUrls: ['./eventEntity.component.scss']
})
export class EventEntityComponent implements OnInit {

    entityDialog: boolean;

    deleteEntitiesDialog: boolean = false;

    deleteEventDialog: boolean = false;

    eventEntities: EventEntity[];

    eventEntity: EventEntity;

    selectedEntities: EventEntity[];

    submitted: boolean;

    cols: any[];


    rowsPerPageOptions = [5, 10, 20];

    

    constructor(private messageService: MessageService,
                private breadcrumbService: BreadcrumbService,
                private eventEntityService: EventEntitiesService) {

        this.breadcrumbService.setItems([
            {label: 'Eventos'}
        ]);

    }
  
    ngOnInit() {


        const getEntitiesObserver: Observer<any> = {
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

        this.eventEntityService.getEventEntities().subscribe(getEntitiesObserver);
        
        
        this.cols = [
            { field: 'code', header: 'Código' },
            { field: 'description', header: 'Descripción' },
            { field: 'actions', header: 'Acciones' },
        ];

    }

    openNew() {
        this.submitted = false;
        this.eventEntity = {};
        this.entityDialog = true;
    }

    deleteSelectedEntities() {
        this.deleteEntitiesDialog = true;
    }


    editEntity(event: EventEntity) {
        this.eventEntity = { ...event };
        this.entityDialog = true;
    }


    deleteEntity(event: EventEntity) {
        this.deleteEntitiesDialog = true;
        this.eventEntity = { ...event };
    }

    confirmDeleteSelected() {
        this.deleteEntitiesDialog = false;
        this.eventEntities = this.eventEntities.filter(event => !this.selectedEntities.includes(event));
        if ( this.eventEntityService.deleteEventEntities(this.selectedEntities) == 0 ){
            this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Eventos eliminados', life: 3000 });
        }
        else{
            console.error("no se pudieron eliminar los eventos seleccionados")
        }
        this.selectedEntities = [];
    }

    /**
     * Use eventEntityService to delete this.event assign on deletEventEntity method
     */
    confirmDelete() {
        const deleteEntityObserver: Observer<any> = {
            next: (value: string) => {
                // Update event array to refresh table
                this.eventEntities = this.eventEntities.filter(val => val.id !== this.eventEntity.id);
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

        this.eventEntityService.deleteEventEntity(this.eventEntity).subscribe(deleteEntityObserver)
    }

    hideDialog() {
        this.entityDialog = false;
        this.submitted = false;
    }

    /**
     * Use eventEntityService.updateEntity tu update/create a event
     */
    saveEntity() {
        this.submitted = true;

        const saveEntityObserver: Observer<any> = {
            next: (event: any) => {
                // Update event array to refresh table
                const oldEventEntityIndex = this.eventEntities.findIndex(r => r.id == event.id);
                const newEventEntity: EventEntity = event;
                if (oldEventEntityIndex != -1)  {
                    this.eventEntities[oldEventEntityIndex] = newEventEntity
                }
                else {
                    this.eventEntities = [...this.eventEntities, newEventEntity]
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
                this.eventEntity = {};
                return 0;
            }
        };

        if (this.eventEntity.name?.trim()) {
            if (this.eventEntity.id) {
                // this.eventEntityService.updateEntity(this.eventEntity).subscribe(saveEntityObserver)
            }
            else {
                this.eventEntityService.newEventEntity(this.eventEntity).subscribe(saveEntityObserver)
            }
        }

    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
