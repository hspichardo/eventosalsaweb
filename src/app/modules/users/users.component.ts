import {Component, OnInit} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {BreadcrumbService} from "../../app.breadcrumb.service";
import { User } from 'src/app/demo/interfaces/user';
import { UserService } from 'src/app/demo/service/userService';
import { Observer } from 'rxjs';
import { Table } from 'primeng/table';


@Component({
    templateUrl: './users.component.html',
    providers: [MessageService, ConfirmationService],
    styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

    userDialog: boolean;

    deleteUsersDialog: boolean = false;

    deleteUserDialog: boolean = false;

    users: User[];

    user: User;

    selectedUsers: User[];

    submitted: boolean;

    cols: any[];


    rowsPerPageOptions = [5, 10, 20];

    

    constructor(private messageService: MessageService,
                private breadcrumbService: BreadcrumbService,
                private userService: UserService) {

        this.breadcrumbService.setItems([
            {label: 'Users'}
        ]);

    }
  
    ngOnInit() {
        const getUsersObserver: Observer<any> = {
            next: (usersArray: any) => {   
                this.users = usersArray.map(user => {
                    return {
                        id: user.id, 
                        username: user.username
                        }
                    })
            },
            error: (error: any) => {
                console.error(error);
                return 1;
            },
            complete: () => {
                return 0;
            }
        };

        this.userService.getUsers().subscribe(getUsersObserver);
        
        
        this.cols = [
            { field: 'username', header: 'Nombre de usuario' },
            { field: 'roles', header: 'Roles' },
        ];

    }

    openNew() {
        this.submitted = false;
        this.user = {};
        this.userDialog = true;
    }

    deleteSelectedUsers() {
        this.deleteUsersDialog = true;
    }


    editUser(user: User) {
        this.user = { ...user };
        this.userDialog = true;
    }


    deleteUser(user: User) {
        this.deleteUserDialog = true;
        this.user = { ...user };
    }

    confirmDeleteSelected() {
        this.deleteUsersDialog = false;
        this.users = this.users.filter(user => !this.selectedUsers.includes(user));
        if ( this.userService.deleteUsers(this.selectedUsers) == 0 ){
            this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Users eliminados', life: 3000 });
        }
        else{
            console.error("no se pudieron eliminar los users seleccionados")
        }
        this.selectedUsers = [];
    }

    /**
     * Use userService to delete this.user assign on deletUser method
     */
    confirmDelete() {
        const deleteUserObserver: Observer<any> = {
            next: (value: string) => {
                // Update user array to refresh table
                this.users = this.users.filter(val => val.id !== this.user.id);
                // UI successful message
                this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Rol eliminado', life: 3000 });
            },
            error: (error: any) => {
                console.error(error);
                return 1;
            },
            complete: () => {
                // Hide user dialog
                this.deleteUserDialog = false;
                return 0;
            }
        };

        this.userService.deleteUser(this.user).subscribe(deleteUserObserver)
    }

    hideDialog() {
        this.userDialog = false;
        this.submitted = false;
    }

    saveUser() {
        this.submitted = true;

        const saveUserObserver: Observer<any> = {
            next: (user: any) => {
                // Update user array to refresh table
                const oldUserIndex = this.users.findIndex(r => r.id == user.id);
                const newUser: User = {id: user.id, username: user.username};
                if (oldUserIndex != -1)  {
                    this.users[oldUserIndex] = newUser
                }
                else {
                    this.users = [...this.users, newUser]
                }
                // UI successful message
                this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'accion completada', life: 3000 });
            },
            error: (error: any) => {
                console.error(error);
                return 1;
            },
            complete: () => {
                // Hide user dialog
                this.userDialog = false;
                this.user = {};
                return 0;
            }
        };

        if (this.user.username?.trim()) {
            if (this.user.id) {
                this.userService.updateUser(this.user).subscribe(saveUserObserver)
            }
            else {
                this.userService.newUser(this.user).subscribe(saveUserObserver)
            }
        }

    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
