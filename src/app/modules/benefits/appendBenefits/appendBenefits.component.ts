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

    listedBenefits: Benefit[];
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
            {label: 'Asignar beneficios'}
        ]);

    }
  
    getBenefitsObserver: Observer<any> = {
        next: (response: ResponseData) => {  
            if (response.status)
            {
                this.selectedAccreditation.benefits = response.data.benefits;
                this.listedBenefits = response.data.benefits;
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

    ngOnInit() {

        this.selectedAccreditation = {benefits:[]}
        this.listedBenefits = [];

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

        // removing benefit
        const benefitsFiltered = this.listedBenefits.filter(benefit => !this.selectedEntities.includes(benefit));
        this.selectedAccreditation.benefits =  benefitsFiltered;

        this.saveEntity()
        this.deleteEntitiesDialog = false;
    }

    /**
     * Use benefitService to delete this.event assign on deletBenefit method
     */
    confirmDelete() {
        
        // removing benefit
        const benefitsFiltered = this.selectedAccreditation.benefits.filter( (benefit) => benefit.id != this.benefit.id)
        this.selectedAccreditation.benefits =  benefitsFiltered;

        this.saveEntity()

        this.deleteEntityDialog = false;

    }

    hideDialog() {
        this.entityDialog = false;
        this.submitted = false;
    }

    updateAccreditationObserver: Observer<any> = {
        next: (response: ResponseData) => {
            if (response.code == 200)
            {
                // Update benefit array to refresh table
                this.selectedAccreditation.benefits = response.data.benefits;
                this.listedBenefits = response.data.benefits;
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: "Acreditación actualizada", life: 3000 });
            }
            else
            {
                console.error(response.message);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message, life: 3000 });
            }
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
        this.selectedAccreditation = event.value;
        this.accreditationService.getAccreditation(this.selectedAccreditation).subscribe(this.getBenefitsObserver);
    }

    //[(ngModel)] directive not working 
    updateSelectedAcreditation(event) {
        // this.clientAccreditation.accreditation = event.value
    }

}
