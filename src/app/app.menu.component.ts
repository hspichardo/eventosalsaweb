import { Component, OnInit } from '@angular/core';
import { AppMainComponent } from './app.main.component';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[];

    constructor(public app: AppMainComponent) { }

    ngOnInit() {
        this.model = [
            // {label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/']},
            {
                label: 'Usuarios', icon: 'pi pi-fw pi-star', routerLink: ['/'],
                // items: [
                //     {label: 'Roles', icon: 'pi pi-fw pi-id-card', routerLink: ['/roles']}
                // ]
            },
            {
                label: 'Roles', icon: 'pi pi-fw pi-briefcase', routerLink: ['/roles'],

            }
        ];
    }
}
