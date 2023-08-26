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
            },
            {
                label: 'Eventos', icon: 'pi pi-fw pi-briefcase', routerLink: ['/eventos'],
            },
            {
                label: 'Beneficios', icon: 'pi pi-fw pi-briefcase',
                items: [
                    {label: 'Listar beneficios', icon: 'pi pi-fw pi-briefcase', routerLink: ['/beneficios']},
                    {label: 'Asignar en acreditación', icon: 'pi pi-fw pi-briefcase',  routerLink: ['/asignar_beneficios']}
                ]
            },
            {
                label: 'Acreditaciones', icon: 'pi pi-fw pi-briefcase', routerLink: ['/acreditaciones'],
            },
            {
                label: 'Clientes', icon: 'pi pi-fw pi-briefcase',
                items: [
                    {label: 'ver clientes', icon: 'pi pi-fw pi-id-card', routerLink: ['/clientes']},
                    {label: 'Asignar acreditación', icon: 'pi pi-fw pi-id-card', routerLink: ['/acreditacion_cliente']},
                    {label: 'Formulario de personas', icon: 'pi pi-fw pi-id-card', routerLink: ['/formulario_personas']},
                    {label: 'Certificados', icon: 'pi pi-fw pi-id-card', routerLink: ['/certificados']}
                ]
            }
        ];
    }
}
