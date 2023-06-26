import {Component, OnInit} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {BreadcrumbService} from "../../app.breadcrumb.service";
import { Role } from 'src/app/demo/interfaces/role';
import { RolesService } from 'src/app/demo/service/rolesService';
import { Observer } from 'rxjs';
import { Table } from 'primeng/table';


@Component({
    templateUrl: './roles.component.html',
    providers: [MessageService, ConfirmationService],
    styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {

    roleDialog: boolean;

    deleteRolesDialog: boolean = false;

    deleteRoleDialog: boolean = false;

    roles: Role[];

    role: Role;

    selectedRoles: Role[];

    submitted: boolean;

    cols: any[];


    rowsPerPageOptions = [5, 10, 20];

    

    constructor(private messageService: MessageService,
                private breadcrumbService: BreadcrumbService,
                private roleService: RolesService) {

        this.breadcrumbService.setItems([
            {label: 'Roles'}
        ]);

    }
  
    ngOnInit() {
        const getRolesObserver: Observer<any> = {
            next: (rolesArray: any) => {                
                this.roles = rolesArray.map(role => {
                    return {id: role.id, 
                            name: role.nombre, 
                            description: role.descripcion 
                    }})
            },
            error: (error: any) => {
                console.error(error);
                return 1;
            },
            complete: () => {
                return 0;
            }
        };

        this.roleService.getRoles().subscribe(getRolesObserver);
        
        
        this.cols = [
            { field: 'name', header: 'Nombre' },
            { field: 'description', header: 'Descripción' },
            { field: 'actions', header: 'Acciones' },
        ];

    }

    openNew() {
        this.submitted = false;
        this.role = {};
        this.roleDialog = true;
    }

    deleteSelectedRoles() {
        this.deleteRolesDialog = true;
    }


    editRole(role: Role) {
        this.role = { ...role };
        this.roleDialog = true;
    }


    deleteRole(role: Role) {
        this.deleteRoleDialog = true;
        this.role = { ...role };
    }

    confirmDeleteSelected() {
        this.deleteRolesDialog = false;
        this.roles = this.roles.filter(role => !this.selectedRoles.includes(role));
        if ( this.roleService.deleteRoles(this.selectedRoles) == 0 ){
            this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Roles eliminados', life: 3000 });
        }
        else{
            console.error("no se pudieron eliminar los roles seleccionados")
        }
        this.selectedRoles = [];
    }

    /**
     * Use roleService to delete this.role assign on deletRole method
     */
    confirmDelete() {
        const deleteRoleObserver: Observer<any> = {
            next: (value: string) => {
                // Update role array to refresh table
                this.roles = this.roles.filter(val => val.id !== this.role.id);
                // UI successful message
                this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Rol eliminado', life: 3000 });
            },
            error: (error: any) => {
                console.error(error);
                return 1;
            },
            complete: () => {
                // Hide role dialog
                this.deleteRoleDialog = false;
                return 0;
            }
        };

        this.roleService.deleteRole(this.role).subscribe(deleteRoleObserver)
    }

    hideDialog() {
        this.roleDialog = false;
        this.submitted = false;
    }

    saveRole() {
        this.submitted = true;

        const saveRoleObserver: Observer<any> = {
            next: (role: any) => {
                // Update role array to refresh table
                const oldRoleIndex = this.roles.findIndex(r => r.id == role.id);
                const newRole: Role = {id: role.id, name: role.nombre, description: role.descripcion };
                if (oldRoleIndex != -1)  {
                    this.roles[oldRoleIndex] = newRole
                }
                else {
                    this.roles = [...this.roles, newRole]
                }
                // UI successful message
                this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'accion completada', life: 3000 });
            },
            error: (error: any) => {
                console.error(error);
                return 1;
            },
            complete: () => {
                // Hide role dialog
                this.roleDialog = false;
                this.role = {};
                return 0;
            }
        };

        if (this.role.name?.trim()) {
            if (this.role.id) {
                this.roleService.updateRole(this.role).subscribe(saveRoleObserver)
            }
            else {
                this.roleService.newRole(this.role).subscribe(saveRoleObserver)
            }
        }

    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
