import {Component, OnInit} from '@angular/core';
import { AppComponent } from './app.component';
import { AppMainComponent } from './app.main.component';

@Component({
    selector: 'app-config',
    template: `
        <a style="cursor: pointer" id="layout-config-button" class="layout-config-button" (click)="onConfigButtonClick($event)">
            <i class="pi pi-cog"></i>
        </a>
        <div class="layout-config" [ngClass]="{'layout-config-active': appMain.configActive}" (click)="appMain.onConfigClick($event)">
            <h5>Menu Type</h5>
            <div class="field-radiobutton">
                <p-radioButton name="menuMode" value="static" [(ngModel)]="app.menuMode" inputId="mode1"></p-radioButton>
                <label for="mode1">Static</label>
            </div>
            <div class="field-radiobutton">
                <p-radioButton name="menuMode" value="overlay" [(ngModel)]="app.menuMode" inputId="mode2"></p-radioButton>
                <label for="mode2">Overlay</label>
            </div>
            <div class="field-radiobutton">
                <p-radioButton name="menuMode" value="slim" [(ngModel)]="app.menuMode" inputId="mode3"></p-radioButton>
                <label for="mode3">Slim</label>
            </div>
            <div class="field-radiobutton">
                <p-radioButton name="menuMode" value="horizontal" [(ngModel)]="app.menuMode" inputId="mode4"></p-radioButton>
                <label for="mode4">Horizontal</label>
            </div>

            <h5>Menu Color</h5>
            <div class="field-radiobutton">
                <p-radioButton name="lightMenu" [value]="true" [(ngModel)]="app.lightMenu" inputId="lightMenu1"></p-radioButton>
                <label for="lightMenu1">Light</label>
            </div>
            <div class="field-radiobutton">
                <p-radioButton name="lightMenu" [value]="false" [(ngModel)]="app.lightMenu" inputId="lightMenu2"></p-radioButton>
                <label for="lightMenu2">Dark</label>
            </div>

            <h5>Input Style</h5>
            <div class="field-radiobutton">
                <p-radioButton name="inputStyle" value="outlined" [(ngModel)]="app.inputStyle" inputId="inputStyle1"></p-radioButton>
                <label for="inputStyle1">Outlined</label>
            </div>
            <div class="field-radiobutton">
                <p-radioButton name="inputStyle" value="filled" [(ngModel)]="app.inputStyle" inputId="inputStyle2"></p-radioButton>
                <label for="inputStyle2">Filled</label>
            </div>

            <h5>Ripple Effect</h5>
			<p-inputSwitch [ngModel]="app.ripple" (onChange)="appMain.onRippleChange($event)"></p-inputSwitch>

            <h5>Menu Themes</h5>
            <div class="layout-themes">
                <div *ngFor="let t of themes">
                    <a style="cursor: pointer" (click)="changeTheme(t.name)"
                       [ngStyle]="{'background-image': 'linear-gradient(to right, ' + t.color1 +','+ t.color2+')'} ">
                    </a>
                </div>
            </div>
        </div>
    `
})
export class AppConfigComponent implements OnInit {

    themes: any[];

    constructor(public appMain: AppMainComponent, public app: AppComponent) {}

    ngOnInit() {
        this.themes = [
            {name: 'amber', color1: '#f66b0b', color2: '#efd417' },
            {name: 'blue', color1: '#2872B4', color2: '#26BED0' },
            {name: 'bluegrey', color1: '#16222A', color2: '#3A6073' },
            {name: 'cyan', color1: '#12AABD', color2: '#C4C988' },
            {name: 'darkblue', color1: '#4b6cb7', color2: '#182848' },
            {name: 'deeporange', color1: '#FF2525', color2: '#FFA43B' },
            {name: 'deeppurple', color1: '#5023A0', color2: '#7A318D' },
            {name: 'green', color1: '#07b750', color2: '#c7d41b' },
            {name: 'grey', color1: '#333333', color2: '#5A5D60' },
            {name: 'indigo', color1: '#1e469a', color2: '#49a7c1' },
            {name: 'lime', color1: '#53C018', color2: '#C6D309' },
            {name: 'mojito', color1: '#1D976C', color2: '#93F9B9' },
            {name: 'pink', color1: '#e02365', color2: '#db3c06' },
            {name: 'purple', color1: '#B721FF', color2: '#21D4FD' },
            {name: 'yellow', color1: '#F39C05', color2: '#F3C704' },
        ];
    }

    changeTheme(theme: string) {
        this.app.theme = theme;

        const layoutLink: HTMLLinkElement = document.getElementById('layout-css') as HTMLLinkElement;
        const layoutHref = 'assets/layout/css/layout-' + theme + '.css';

        this.replaceLink(layoutLink, layoutHref);

        const themeLink: HTMLLinkElement = document.getElementById('theme-css') as HTMLLinkElement;
        const themeHref = 'assets/theme/theme-' + theme  + '.css';

        this.replaceLink(themeLink, themeHref);
    }

    isIE() {
        return /(MSIE|Trident\/|Edge\/)/i.test(window.navigator.userAgent);
    }

    replaceLink(linkElement, href) {
        if (this.isIE()) {
            linkElement.setAttribute('href', href);
        } else {
            const id = linkElement.getAttribute('id');
            const cloneLinkElement = linkElement.cloneNode(true);

            cloneLinkElement.setAttribute('href', href);
            cloneLinkElement.setAttribute('id', id + '-clone');

            linkElement.parentNode.insertBefore(cloneLinkElement, linkElement.nextSibling);

            cloneLinkElement.addEventListener('load', () => {
                linkElement.remove();
                cloneLinkElement.setAttribute('id', id);
            });
        }
    }

    onConfigButtonClick(event) {
        this.appMain.configActive = !this.appMain.configActive;
        this.appMain.configClick = true;
        event.preventDefault();
    }
}
