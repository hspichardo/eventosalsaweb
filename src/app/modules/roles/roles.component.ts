import {Component, OnInit} from '@angular/core';
import {Product} from '../../demo/domain/product';
import {ProductService} from '../../demo/service/productservice';
import {ConfirmationService, MessageService} from 'primeng/api';
import {BreadcrumbService} from "../../app.breadcrumb.service";
import { Table } from 'primeng/table';
import { Role } from 'src/app/demo/interfaces/role';
import { RolesService } from 'src/app/demo/service/rolesService';


@Component({
    templateUrl: './roles.component.html',
    providers: [MessageService, ConfirmationService],
    styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {

    productDialog: boolean;
    roleDialog: boolean;

    deleteProductDialog: boolean = false;
    deleteRolesDialog: boolean = false;

    deleteProductsDialog: boolean = false;

    products: Product[];
    roles: Role[];

    product: Product;
    role: Role;

    selectedProducts: Product[];
    selectedRoles: Role[];

    submitted: boolean;

    cols: any[];

    statuses: any[];

    rowsPerPageOptions = [5, 10, 20];

    

    constructor(private productService: ProductService, private messageService: MessageService,
                private confirmationService: ConfirmationService, private breadcrumbService: BreadcrumbService,
                private roleService: RolesService) {
        this.breadcrumbService.setItems([
            {label: 'Pages'},
            {label: 'Crud'}
        ]);
    }
  
    ngOnInit() {
        this.productService.getProducts().then(data => this.products = data);
        this.roleService.getRoles().then(data => {this.roles = data;console.log(data)});
        
        
        this.cols = [
            { field: 'name', header: 'Nombre' },
            { field: 'description', header: 'Descripción' },
            { field: 'actions', header: 'Acciones' },
        ];

        this.statuses = [
            { label: 'ROL_A', value: 'ROL_A' },
            { label: 'ROL_B', value: 'ROL_B' },
            { label: 'ROL_C', value: 'ROL_C' }
        ];
    }

    openNew() {
        this.product = {};
        this.submitted = false;
        // this.productDialog = true;
        this.role = {};
        this.roleDialog = true;
    }

    deleteSelectedProducts() {
        this.deleteProductsDialog = true;
    }

    deleteSelectedRoles() {
        this.deleteRolesDialog = true;
    }

    editProduct(product: Product) {
        this.product = { ...product };
        this.productDialog = true;
    }

    deleteProduct(product: Product) {
        this.deleteProductDialog = true;
        this.product = { ...product };
    }

    confirmDeleteSelected() {
        this.deleteProductsDialog = false;
        this.products = this.products.filter(val => !this.selectedProducts.includes(val));
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
        this.selectedProducts = [];
    }

    confirmDelete() {
        this.deleteProductDialog = false;
        this.products = this.products.filter(val => val.id !== this.product.id);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
        this.product = {};
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    saveProduct() {
        this.submitted = true;

        if (this.product.name?.trim()) {
            if (this.product.id) {
                // @ts-ignore
                this.product.inventoryStatus = this.product.inventoryStatus.value ? this.product.inventoryStatus.value : this.product.inventoryStatus;
                this.products[this.findIndexById(this.product.id)] = this.product;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
            } else {
                this.product.id = this.createId();
                this.product.code = this.createId();
                this.product.image = 'product-placeholder.svg';
                // @ts-ignore
                this.product.inventoryStatus = this.product.inventoryStatus ? this.product.inventoryStatus.value : 'ROL_A';
                this.products.push(this.product);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
            }

            this.products = [...this.products];
            this.productDialog = false;
            this.product = {};
        }
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].id === id) {
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
