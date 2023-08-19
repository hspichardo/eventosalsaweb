import {Component, OnInit} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {BreadcrumbService} from "../../../app.breadcrumb.service";
import { Observer } from 'rxjs';
import { Table } from 'primeng/table';
import { ResponseData } from 'src/app/demo/interfaces/ResponseData';
import { Benefit } from 'src/app/demo/interfaces/benefit';
import { BenefitService } from 'src/app/demo/service/benefitService';
import { Accreditation } from 'src/app/demo/interfaces/accreditation';
import { AccreditationService } from 'src/app/demo/service/accreditationService';


@Component({
    templateUrl: './appendBenefits.component.html',
    providers: [MessageService, ConfirmationService],
    styleUrls: ['./appendBenefits.component.scss']
})
export class AppendBenefitsComponent implements OnInit {

    entityDialog: boolean;

    deleteEntitiesDialog: boolean = false;
    deleteEntityDialog: boolean = false;

    deleteEventDialog: boolean = false;

    benefits: Benefit[];
    allBenefits: Benefit[];
    newPossibleBenefits: Benefit[];
    selectedNewBenefit: Benefit;
    
    benefit: Benefit;
    
    selectedEntities: Benefit[];
    
    submitted: boolean;
    
    cols: any[];
    cols_newBenefit: any[];
    
    selectedAccreditation: Accreditation;

    accreditations: Accreditation[];


    rowsPerPageOptions = [5, 10, 20];

    

    constructor(private messageService: MessageService,
                private breadcrumbService: BreadcrumbService,
                private benefitService: BenefitService,
                private accreditationService: AccreditationService) {

        this.breadcrumbService.setItems([
            {label: 'Beneficios'}
        ]);

    }
  
    getBenefitsObserver: Observer<any> = {
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

    ngOnInit() {

        const getAccreditationsObserver: Observer<any> = {
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

        const getEntitiesObserver: Observer<any> = {
            next: (response: ResponseData) => {  
                this.allBenefits = response.data
            },
            error: (error: any) => {
                console.error(error);
                return 1;
            },
            complete: () => {
                return 0;
            }
        };

        this.accreditationService.getAccreditations().subscribe(getAccreditationsObserver);
        
        this.benefitService.getBenefits().subscribe(getEntitiesObserver);
        
        
        this.cols = [
            { field: 'description', header: 'Descripción' },
            { field: 'quantity', header: 'Cupos asignables' },
            { field: 'actions', header: 'Acciones' },
        ];

        this.cols_newBenefit = [
            { field: 'description', header: 'Beneficios asignables' }
        ];

    }

    openNew() {
        this.submitted = false;
        this.benefit = {quantity:0};
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

    updateAccreditationObserver: Observer<any> = {
        next: (response: ResponseData) => {
            // Update benefit array to refresh table
            const newBenefit: Benefit = response.data;
            console.log(response)
            // const oldBenefitIndex = this.benefits.findIndex(r => r.id == newBenefit.id);
            // if (oldBenefitIndex != -1)  {
            //     this.benefits[oldBenefitIndex] = newBenefit
            //     console.log(oldBenefitIndex)
            // }
            // else {
            //     this.benefits = [...this.benefits, newBenefit]
            // }
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
            return 0;
        }
    };

    /**
     * Use benefitService.updateEntity tu update/create a event
     */
    saveEntity() {
        this.accreditationService.updateAccreditation(this.selectedAccreditation).subscribe(this.updateAccreditationObserver)
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    //[(ngModel)] directive not working 
    updateBenefitsTable(event) {
        // this.accreditation.client = event.value
        this.benefitService.getBenefits().subscribe(this.getBenefitsObserver);
    }

    //[(ngModel)] directive not working 
    updateSelectedAcreditation(event) {
        // this.clientAccreditation.accreditation = event.value
    }

}
