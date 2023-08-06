import {Component, OnInit} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {BreadcrumbService} from "../../app.breadcrumb.service";
import { Observer } from 'rxjs';
import { Table } from 'primeng/table';
import { ResponseData } from 'src/app/demo/interfaces/ResponseData';
import { Benefit } from 'src/app/demo/interfaces/benefit';
import { BenefitService } from 'src/app/demo/service/benefitService';


@Component({
    templateUrl: './benefits.component.html',
    providers: [MessageService, ConfirmationService],
    styleUrls: ['./benefits.component.scss']
})
export class BenefitComponent implements OnInit {

    entityDialog: boolean;

    deleteEntitiesDialog: boolean = false;

    deleteEventDialog: boolean = false;

    benefits: Benefit[];

    benefit: Benefit;

    selectedEntities: Benefit[];

    submitted: boolean;

    cols: any[];


    rowsPerPageOptions = [5, 10, 20];

    

    constructor(private messageService: MessageService,
                private breadcrumbService: BreadcrumbService,
                private benefitService: BenefitService) {

        this.breadcrumbService.setItems([
            {label: 'Eventos'}
        ]);

    }
  
    ngOnInit() {


        const getEntitiesObserver: Observer<any> = {
            next: (response: ResponseData) => {  
                this.benefits = response.data
            },
            error: (error: any) => {
                console.error(error);
                return 1;
            },
            complete: () => {
                return 0;
            }
        };

        this.benefitService.getBenefits().subscribe(getEntitiesObserver);
        
        
        this.cols = [
            { field: 'id', header: 'Id' },
            { field: 'description', header: 'Descripción' },
            { field: 'actions', header: 'Acciones' },
        ];

    }

    openNew() {
        this.submitted = false;
        this.benefit = {};
        this.entityDialog = true;
    }

    deleteSelectedEntities() {
        this.deleteEntitiesDialog = true;
    }


    editEntity(event: Benefit) {
        this.benefit = { ...event };
        this.entityDialog = true;
    }


    deleteEntity(event: Benefit) {
        this.deleteEntitiesDialog = true;
        this.benefit = { ...event };
    }

    confirmDeleteSelected() {
        this.deleteEntitiesDialog = false;
        this.benefits = this.benefits.filter(event => !this.selectedEntities.includes(event));
        if ( this.benefitService.deleteBenefits(this.selectedEntities) == 0 ){
            this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Eventos eliminados', life: 3000 });
        }
        else{
            console.error("no se pudieron eliminar los eventos seleccionados")
        }
        this.selectedEntities = [];
    }

    /**
     * Use benefitService to delete this.event assign on deletBenefit method
     */
    confirmDelete() {
        const deleteEntityObserver: Observer<any> = {
            next: (value: string) => {
                // Update event array to refresh table
                this.benefits = this.benefits.filter(val => val.id !== this.benefit.id);
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

        this.benefitService.deleteBenefit(this.benefit).subscribe(deleteEntityObserver)
    }

    hideDialog() {
        this.entityDialog = false;
        this.submitted = false;
    }

    /**
     * Use benefitService.updateEntity tu update/create a event
     */
    saveEntity() {
        this.submitted = true;

        const saveEntityObserver: Observer<any> = {
            next: (event: any) => {
                // Update event array to refresh table
                const oldBenefitIndex = this.benefits.findIndex(r => r.id == event.id);
                const newBenefit: Benefit = event;
                if (oldBenefitIndex != -1)  {
                    this.benefits[oldBenefitIndex] = newBenefit
                }
                else {
                    this.benefits = [...this.benefits, newBenefit]
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
                this.benefit = {};
                return 0;
            }
        };

        if (this.benefit.description?.trim()) {
            if (this.benefit.id) {
                // this.benefitService.updateEntity(this.benefit).subscribe(saveEntityObserver)
            }
            else {
                this.benefitService.newBenefit(this.benefit).subscribe(saveEntityObserver)
            }
        }

    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
