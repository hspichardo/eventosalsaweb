import {Component, OnInit} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {BreadcrumbService} from "../../app.breadcrumb.service";
import { Table } from 'primeng/table';
import { UserElement } from 'src/app/demo/interfaces/userElement';
import { UserElementService } from 'src/app/demo/service/userElementservice';

@Component({
    templateUrl: './manager.component.html',
    providers: [MessageService, ConfirmationService],
    styleUrls: ['../../../assets/demo/badges.scss']
})
export class managerComponent implements OnInit {

    userElementDialog: boolean;

    deleteUserElementDialog: boolean = false;

    deleteUserElementsDialog: boolean = false;

    userElements: UserElement[];

    userElement: UserElement;

    selectedUserElements: UserElement[];

    submitted: boolean;

    cols: any[];

    statuses: any[];

    rowsPerPageOptions = [5, 10, 20];

    constructor(private userElementService: UserElementService, private messageService: MessageService,
                private confirmationService: ConfirmationService, private breadcrumbService: BreadcrumbService) {
        this.breadcrumbService.setItems([
            {label: 'Pages'},
            {label: 'Crud'}
        ]);
    }
  
    ngOnInit() {
        this.userElementService.getUserElements().then(data => this.userElements = data);

        this.cols = [
            { field: 'userElement', header: 'UserElement' },
            { field: 'price', header: 'Price' },
            { field: 'category', header: 'Category' },
            { field: 'rating', header: 'Reviews' },
            { field: 'inventoryStatus', header: 'Status' }
        ];

        this.statuses = [
            { label: 'ROL_A', value: 'ROL_A' },
            { label: 'ROL_B', value: 'ROL_B' },
            { label: 'ROL_C', value: 'ROL_C' }
        ];
    }

    openNew() {
        this.userElement = {};
        this.submitted = false;
        this.userElementDialog = true;
    }

    deleteSelectedUserElements() {
        this.deleteUserElementsDialog = true;
    }

    editUserElement(userElement: UserElement) {
        this.userElement = { ...userElement };
        this.userElementDialog = true;
    }

    deleteUserElement(userElement: UserElement) {
        this.deleteUserElementDialog = true;
        this.userElement = { ...userElement };
    }

    confirmDeleteSelected() {
        this.deleteUserElementsDialog = false;
        this.userElements = this.userElements.filter(val => !this.selectedUserElements.includes(val));
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'UserElements Deleted', life: 3000 });
        this.selectedUserElements = [];
    }

    confirmDelete() {
        this.deleteUserElementDialog = false;
        this.userElements = this.userElements.filter(val => val.id !== this.userElement.id);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'UserElement Deleted', life: 3000 });
        this.userElement = {};
    }

    hideDialog() {
        this.userElementDialog = false;
        this.submitted = false;
    }

    saveUserElement() {
        this.submitted = true;

        if (this.userElement.name?.trim()) {
            if (this.userElement.id) {
                // @ts-ignore
                this.userElement.inventoryStatus = this.userElement.inventoryStatus.value ? this.userElement.inventoryStatus.value : this.userElement.inventoryStatus;
                this.userElements[this.findIndexById(this.userElement.id)] = this.userElement;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'UserElement Updated', life: 3000 });
            } else {
                this.userElement.id = this.createId();
                this.userElement.code = this.createId();
                this.userElement.image = 'userElement-placeholder.svg';
                // @ts-ignore
                this.userElement.inventoryStatus = this.userElement.inventoryStatus ? this.userElement.inventoryStatus.value : 'ROL_A';
                this.userElements.push(this.userElement);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'UserElement Created', life: 3000 });
            }

            this.userElements = [...this.userElements];
            this.userElementDialog = false;
            this.userElement = {};
        }
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.userElements.length; i++) {
            if (this.userElements[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = '';
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
