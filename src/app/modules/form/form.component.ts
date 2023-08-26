import { Location } from '@angular/common';
import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {ConfirmationService, Message, MessageService} from 'primeng/api';
import { Observer } from 'rxjs';
import { ResponseData } from 'src/app/demo/interfaces/ResponseData';
import { FormPerson } from 'src/app/demo/interfaces/formPerson';
import { Person } from 'src/app/demo/interfaces/person';
import { FormPersonService } from 'src/app/demo/service/formPersonService';
import { PersonService } from 'src/app/demo/service/personService';

@Component({
    templateUrl: './form.component.html',
    providers: [MessageService, ConfirmationService],
    styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  
    submitted: boolean = false;
    msgs: Message[] = [];
    provinces : Array<string>;
    cantons : Array<string>;
    charges : Array<string>;
    ticket_given_means_options : Array<string>;
    person : Person;
    formPerson: FormPerson;


    constructor(
        private messageService: MessageService,
        private personService: PersonService,
        private formPersonService: FormPersonService,
        private location: Location,
        private router: Router) {}
  
    ngOnInit() {
        this.getFormPerson();    

        this.provinces = ["Azuay", "Bolívar", "Cañar", "Carchi", "Chimborazo", "Cotopaxi", "El Oro", "Esmeraldas", "Galápagos", "Guayas", "Imbabura", "Loja", "Los Ríos", "Manabí", "Morona Santiago", "Napo", "Orellana", "Pastaza", "Pichincha", "Santa Elena", "Santo Domingo de los Tsáchilas", "Sucumbíos", "Tungurahua", "Zamora-Chinchipe" ];
        this.cantons = [ "24 de Mayo","A.B. Lalama","Aguarico","Alamor","Alausí","Alfredo Baquerizo Moreno","Ambato","Antonio Ante","Archidona","Arenillas","Atacames","Azogues","Baba","Babahoyo","Balao","Balsas","Baltazar Castro","Baños de Agua Santa","Biblián","Bolívar","Bolívar","Bolívar","Bolívar","Buena Fe","Cañar","Caluma","Calvas","Camilo Ponce Enríquez","Carlos Julio Arosemena Tola","Cascales","Catamayo","Cayambe","Celica","Centinela del Cóndor","Cevallos","Chambo","Chilla","Chillanes","Chimbo","Chinchipe","Chone","Chordeleg","Colimes","Colta","Coronel Marcelino Maridueña","Cotacachi","Cuenca","Cumandá","Cuyabeno","Daule","Déleg","Diego de Almagro","Durán","Echeandía","El Carmen","El Chaco","El Empalme","El Guabo","El Pan","El Pangui","El Tambo","Eloy Alfaro","Eloy Alfaro","Emelec","Esmeraldas","Espejo","Flavio Alfaro","Francisco de Orellana","General Antonio Elizalde","Girón","Gonzanamá","Gualaceo","Gualaquiza","Guamote","Guano","Guaranda","Guayaquil","Huamboya","Huaquillas","Ibarra","Isabela","Isidro Ayora","Jama","Jaramijó","Jipijapa","Junín","La Concordia","La Joya de los Sachas","La Libertad","La Maná","La Troncal","La Unión","La Victoria","Lago Agrio","Las Lajas","Las Naves","Loja","Lomas de Sargentillo","Loreto","Macará","Machachi","Machala","Manta","Marcabelí","Marcovia","María Auxiliadora","Mera","Milagro","Mira","Montalvo","Montecristi","Morona","Nabón","Nangaritza","Naranjal","Naranjito","Napo","Oña","Olmedo","Olmedo","Orellana","Otavalo","Paján","Palenque","Palora","Paltas","Pangua","Panguintza","Pedro Carbo","Pedro Moncayo","Pelileo","Penipe","Piñas","Playas","Pucará","Puebloviejo","Puerto López","Puerto Napo","Putumayo","Puyango","Puyo","Quero","Quevedo","Quijos","Quilanga","Quinindé","Riobamba","Rioverde","Rocafuerte","Rumiñahui","Salcedo","Salinas","Salitre","Samborondón","San Cristóbal","San Fernando","San Francisco de Borja","San Juan Bosco","San Lorenzo","San Lorenzo","San Miguel","San Miguel de Los Bancos","San Pablo","San Pedro de Huaca","San Vicente","Santa Ana","Santa Clara","Santa Cruz","Santa Elena","Santa Lucía","Santa Rosa","Santa Rosa","Santa Rosa de Quijos","Santiago","Santo Domingo","Saquisilí","Saraguro","Sevilla de Oro","Shushufindi","Sigchos","Simón Bolívar","Sozoranga","Sucúa","Sucumbíos","Suscal","Taisha","Tena","Tosagua","Tulcán","Valencia","Ventanas","Vinces","Yacuambi","Yaguachi","Yantzaza","Zamora","Zaruma","Zumbahua"]
        this.charges = ["Prefecto", "Alcalde", "Ministro", "Gobernador", "Director", "Empresario", "Profesional", "Académico"]
        this.ticket_given_means_options = ["AME", "CONGOPE", "La Organización", "Ministerio de turismo"];
        this.person = {};

        
        
    }
    
    cleanKey(key: string)
    {
        return key.replace("/form/", "").replace("_slashslash_",'/')
    }

    getFormPerson()
    {
        const currentUrl = this.location.path();
        const key = this.cleanKey(currentUrl)

        const getFormPersonObserver: Observer<any> = {
            next: (response: ResponseData) => {  
                if (response.status)
                {
                    this.person.registration_form = response.data
                }
                else{
                    this.router.navigate(['/error']);
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


        this.formPersonService.getFormPersonBykey(key).subscribe(getFormPersonObserver)

    }


    save(){
        this.submitted = true;

        const newPersonObserver: Observer<any> = {
            next: (response: ResponseData) => {  

                if (response.status)
                {
                    this.router.navigate(['/registro_exitoso']);
                }
                else{
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

        this.messageService.add({ severity: 'info', summary: 'Atención', detail: 'Espere mientras se envia su registro', life: 3000 });
        this.personService.newPerson(this.person).subscribe(newPersonObserver)

    }
}
