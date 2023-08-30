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
    deleteEntityDialog: boolean = false;

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
            {label: 'Beneficios'}
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
            { field: 'description', header: 'Descripción' },
            { field: 'quantity', header: 'Cupos asignables' },
            { field: 'certificado', header: 'Certificado' },
            { field: 'actions', header: 'Acciones' },
        ];

    }

    openNew() {
        this.submitted = false;
        this.benefit = {quantity:0, generate_certificate:false};
        this.entityDialog = true;
    }

    deleteSelectedEntities() {
        this.deleteEntitiesDialog = true;
    }


    editEntity(entity: Benefit) {
        this.benefit = { ...entity };
        this.benefit.accreditation = null;
        this.benefit.registration_form = [];
        this.entityDialog = true;
    }


    deleteEntity(entity: Benefit) {
        this.deleteEntityDialog = true;
        this.benefit = { ...entity };
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
                this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Beneficio eliminado', life: 3000 });
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
            next: (response: ResponseData) => {
                // Update benefit array to refresh table
                const newBenefit: Benefit = response.data;
                const oldBenefitIndex = this.benefits.findIndex(r => r.id == newBenefit.id);
                if (oldBenefitIndex != -1)  {
                    this.benefits[oldBenefitIndex] = newBenefit
                    console.log(oldBenefitIndex)
                }
                else {
                    this.benefits = [...this.benefits, newBenefit]
                }
                // UI successful message
                this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'acción completada', life: 3000 });
            },
            error: (error: any) => {
                console.error(error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: error, life: 3000 });
                return 1;
            },
            complete: () => {
                // Hide new entity dialog
                this.entityDialog = false;
                this.benefit = {quantity:0};
                return 0;
            }
        };

        if (this.benefit.description?.trim() && this.benefit.quantity >= 0) {
            this.submitted = false;
            if (this.benefit.id) {
                this.benefitService.updateBenefit(this.benefit).subscribe(saveEntityObserver)
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
