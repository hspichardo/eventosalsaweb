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
import { Benefit } from 'src/app/demo/interfaces/benefit';
import { BenefitService } from 'src/app/demo/service/benefitService';


@Component({
    templateUrl: './accreditations.component.html',
    providers: [MessageService, ConfirmationService, EventEntitiesService],
    styleUrls: ['./accreditations.component.scss']
})
export class AccreditationComponent implements OnInit {

    entityDialog: boolean;

    deleteEntitiesDialog: boolean = false;
    
    deleteEntityDialog: boolean = false;

    deleteEventDialog: boolean = false;

    accreditations: Accreditation[];

    accreditation: Accreditation;

    selectedEntities: Accreditation[];

    submitted: boolean;

    cols: any[];

    eventEntities: EventEntity[];

    allBenefits: Benefit[];
    selectedBenefits: Benefit[];
    
    selectedEventEntity: EventEntity;

    updateAccreditationDialogFlag: boolean = false;


    rowsPerPageOptions = [5, 10, 20];

    

    constructor(private messageService: MessageService,
                private breadcrumbService: BreadcrumbService,
                private accreditationService: AccreditationService,
                private eventEntityService: EventEntitiesService,
                private benefitService: BenefitService) {

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
                console.log(response)  
                this.eventEntities = response.data as EventEntity[]
            },
            error: (error: any) => {
                console.error(error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: "Error al obtener los eventos", life: 3000 });
                return 1;
            },
            complete: () => {
                return 0;
            }
        };

        const getBenefitsObserver: Observer<any> = {
            next: (response: ResponseData) => {  
                this.allBenefits = response.data
            },
            error: (error: any) => {
                console.error(error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: "Error al obtener los beneficios", life: 3000 });
                return 1;
            },
            complete: () => {
                return 0;
            }
        };

        this.benefitService.getBenefits().subscribe(getBenefitsObserver);
        this.eventEntityService.getEventEntities().subscribe(getEventEntitiesObserver);
        // this.accreditationService.getAccreditations().subscribe(getEntitiesObserver);
        this.accreditations = new Array<Accreditation>();
        
        
        this.cols = [
            { field: 'description', header: 'Descripción' },
            { field: 'cost', header: 'Costo' },
            { field: 'benefits', header: '# Beneficios' },
            { field: 'actions', header: 'Acciones' },
        ];

    }

    openNew() {
        this.submitted = false;
        this.accreditation = { event:this.selectedEventEntity, cost:0};
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


    editEntity(accreditation: Accreditation) {
        this.accreditation = { ...accreditation };

        const selectedBenefitsIds = this.accreditation.benefits.map(benefit => benefit.id );
        const selectedBenefitsComplement =  this.allBenefits.filter((benefit:Benefit) => ! selectedBenefitsIds.includes( benefit.id ));
        // this logic is necessary because multiSelect component compare memory directions when using objects, so you must have exactly the same reference
        this.selectedBenefits =  [...this.accreditation.benefits, ...selectedBenefitsComplement]
        this.entityDialog = true;
    }


    deleteEntity(accreditation: Accreditation) {
        this.deleteEntityDialog = true;
        this.accreditation = { ...accreditation };
    }

    confirmDeleteSelected() {
        this.deleteEntitiesDialog = false;
        this.accreditations = this.accreditations.filter(event => !this.selectedEntities.includes(event));
        if ( this.accreditationService.deleteAccreditations(this.selectedEntities) == 0 ){
            this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Eventos eliminados', life: 3000 });
        }
        else{
            console.error("No se pudieron eliminar las acreditaciones seleccionados");
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "No se pudieron eliminar las acreditaciones", life: 3000 });
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
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Acreditación eliminada', life: 3000 });
            },
            error: (error: any) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: error, life: 3000 });
                console.error(error);
                return 1;
            },
            complete: () => {
                // Hide entity dialog
                this.deleteEntityDialog = false;
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
            next: (response: ResponseData) => {
                // Update array to refresh table
                const newEntity : Accreditation = response.data;
                const oldEntityIndex = this.accreditations.findIndex(r => r.id == newEntity.id);
                if (oldEntityIndex != -1)  {
                    this.accreditations[oldEntityIndex] = newEntity
                }
                else {
                    this.accreditations = [...this.accreditations, newEntity]
                }
                // UI successful message
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Acción completada', life: 3000 });
            },
            error: (error: any) => {
                console.error(error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: error, life: 3000 });
                return 1;
            },
            complete: () => {
                // Hide new entity dialog
                this.entityDialog = false;
                this.updateAccreditationDialogFlag = false;
                this.submitted = false;
                this.accreditation = {};

                return 0;
            }
        };

        if (this.accreditation.description?.trim()) {
            if (this.accreditation.id) {
                this.accreditationService.updateAccreditation(this.accreditation).subscribe(saveEntityObserver)
            }
            else {
                this.accreditationService.newAccreditation(this.accreditation).subscribe(saveEntityObserver)
            }
        }

    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    
    updateAcreditationTable() {
        this.accreditationService.getAccreditationsByEventId(this.selectedEventEntity).subscribe(this.getEntitiesObserver);
    }
}
