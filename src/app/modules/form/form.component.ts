import { Location } from '@angular/common';
import {Component, OnInit, ViewChild} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { error } from 'console';
import {ConfirmationService, Message, MessageService} from 'primeng/api';
import { Observer } from 'rxjs';
import { ResponseData } from 'src/app/demo/interfaces/ResponseData';
import { FormPerson } from 'src/app/demo/interfaces/formPerson';
import { Option } from 'src/app/demo/interfaces/option';
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
    sending: boolean = false;
    msgs: Message[] = [];
    provinces : Array<string>;
    cantons : Array<string>;
    cities: Object[] = [];
    charges : Array<string>;
    provincesA: Object[] = [];
    countryS : Array<string>;
    countryA: Object[] = [];
    ticket_given_means_options : Array<string>;
    person : Person;
    formPerson: FormPerson;
    @ViewChild('myForm', { static: true }) myForm: NgForm;

    natural_person : Option;

    people_type: Option[] = [
        { name: 'Persona Natural', key: 'A' },
        { name: 'Empresa', key: 'M' },
        { name: 'Institución', key: 'I' },
    ];
    showLoading: boolean = false;


    constructor(
        private messageService: MessageService,
        private personService: PersonService,
        private formPersonService: FormPersonService,
        private location: Location,
        private router: Router) {}



    ngOnInit() {
        this.getFormPerson();
        this.countryS = ["Japan",
            "Indonesia",
            "India",
            "China",
            "Philippines",
            "Brazil",
            "South Korea",
            "Mexico",
            "Egypt",
            "United States",
            "Bangladesh",
            "Thailand",
            "Russia",
            "Argentina",
            "Nigeria",
            "Turkey",
            "Pakistan",
            "Vietnam",
            "Iran",
            "Congo (Kinshasa)",
            "United Kingdom",
            "France",
            "Peru",
            "Taiwan",
            "Angola",
            "Malaysia",
            "South Africa",
            "Colombia",
            "Tanzania",
            "Sudan",
            "Hong Kong",
            "Saudi Arabia",
            "Chile",
            "Spain",
            "Iraq",
            "Singapore",
            "Cameroon",
            "Kenya",
            "Canada",
            "Myanmar",
            "Côte d'Ivoire",
            "Australia",
            "Germany",
            "Morocco",
            "Afghanistan",
            "Somalia",
            "Jordan",
            "Algeria",
            "Ghana",
            "United Arab Emirates",
            "Bolivia",
            "Greece",
            "Ethiopia",
            "Kuwait",
            "Hungary",
            "Ukraine",
            "Yemen",
            "Guatemala",
            "Italy",
            "North Korea",
            "Ecuador",
            "Portugal",
            "Venezuela",
            "Madagascar",
            "Dominican Republic",
            "Uzbekistan",
            "Zambia",
            "Burkina Faso",
            "Sri Lanka",
            "Azerbaijan",
            "Zimbabwe",
            "Cuba",
            "Cambodia",
            "Mali",
            "Belarus",
            "Austria",
            "Syria",
            "Kazakhstan",
            "Puerto Rico",
            "Malawi",
            "Romania",
            "Poland",
            "Congo (Brazzaville)",
            "Belgium",
            "Uruguay",
            "Uganda",
            "Honduras",
            "Guinea",
            "Sweden",
            "Bulgaria",
            "Costa Rica",
            "Panama",
            "Netherlands",
            "Senegal",
            "Oman",
            "Israel",
            "Mongolia",
            "Serbia",
            "Denmark",
            "New Zealand",
            "Czechia",
            "Libya",
            "Finland",
            "Qatar",
            "Mozambique",
            "Ireland",
            "Rwanda",
            "Georgia",
            "Chad",
            "Burundi",
            "Kyrgyzstan",
            "Armenia",
            "Mauritania",
            "Norway",
            "Tunisia",
            "Nicaragua",
            "Niger",
            "Liberia",
            "Haiti",
            "Nepal",
            "Eritrea",
            "Sierra Leone",
            "Laos",
            "Latvia",
            "Central African Republic",
            "Tajikistan",
            "Togo",
            "Turkmenistan",
            "Croatia",
            "Gabon",
            "Benin",
            "Lithuania",
            "Moldova",
            "Papua New Guinea",
            "Macedonia",
            "Djibouti",
            "Gaza Strip",
            "Jamaica",
            "El Salvador",
            "Paraguay",
            "South Sudan",
            "Lesotho",
            "Guinea-Bissau",
            "Malta",
            "Slovakia",
            "Bahrain",
            "Estonia",
            "Lebanon",
            "Albania",
            "Bosnia and Herzegovina",
            "The Gambia",
            "Cyprus",
            "Namibia",
            "Reunion",
            "Slovenia",
            "The Bahamas",
            "Martinique",
            "Botswana",
            "Suriname",
            "Timor-Leste",
            "Guyana",
            "Gibraltar",
            "Equatorial Guinea",
            "Fiji",
            "New Caledonia",
            "Kosovo",
            "Maldives",
            "Mauritius",
            "Montenegro",
            "Curaçao",
            "Switzerland",
            "Iceland",
            "Luxembourg",
            "French Polynesia",
            "Cabo Verde",
            "Barbados",
            "Comoros",
            "Bhutan",
            "Swaziland",
            "Solomon Islands",
            "Trinidad and Tobago",
            "Saint Lucia",
            "French Guiana",
            "Sao Tome and Principe",
            "Vanuatu",
            "Brunei",
            "Monaco",
            "Samoa",
            "Kiribati",
            "Aruba",
            "Jersey",
            "Mayotte",
            "Marshall Islands",
            "Isle Of Man",
            "Cayman Islands",
            "Seychelles",
            "Saint Vincent and the Grenadines",
            "Andorra",
            "Antigua and Barbuda",
            "Tonga",
            "Greenland",
            "Belize",
            "Dominica",
            "Saint Kitts and Nevis",
            "Faroe Islands",
            "British Virgin Islands",
            "American Samoa",
            "Turks and Caicos Islands",
            "Saint Martin",
            "Federated States of Micronesia",
            "Tuvalu",
            "Liechtenstein",
            "Cook Islands",
            "Grenada",
            "San Marino",
            "Sint Maarten",
            "Northern Mariana Islands",
            "Falkland Islands (Islas Malvinas)",
            "Bermuda",
            "Vatican City",
            "Niue",
            "Guadeloupe",
            "Guam",
            "Saint Helena", "Ascension", "and Tristan da Cunha",
            "Montserrat",
            "Nauru",
            "Saint Barthelemy",
            "Palau",
            "Saint Pierre and Miquelon",
            "Anguilla",
            "Wallis and Futuna",
            "Norfolk Island",
            "Svalbard",
            "Pitcairn Islands",
            "Christmas Island",
            "South Georgia And South Sandwich Islands",
            "Macau",
            "West Bank",
            "Bonaire", "Sint Eustatius", "and Saba",
            "U.S. Virgin Islands"
        ]
        this.provinces = ["Azuay", "Bolívar", "Cañar", "Carchi", "Chimborazo", "Cotopaxi", "El Oro", "Esmeraldas", "Galápagos", "Guayas", "Imbabura", "Loja", "Los Ríos", "Manabí", "Morona Santiago", "Napo", "Orellana", "Pastaza", "Pichincha", "Santa Elena", "Santo Domingo de los Tsáchilas", "Sucumbíos", "Tungurahua", "Zamora-Chinchipe" ];
        this.cantons = [ "24 de Mayo","A.B. Lalama","Aguarico","Alamor","Alausí","Alfredo Baquerizo Moreno","Ambato","Antonio Ante","Archidona","Arenillas","Atacames","Azogues","Baba","Babahoyo","Balao","Balsas","Baltazar Castro","Baños de Agua Santa","Biblián","Bolívar","Bolívar","Bolívar","Bolívar","Buena Fe","Cañar","Caluma","Calvas","Camilo Ponce Enríquez","Carlos Julio Arosemena Tola","Cascales","Catamayo","Cayambe","Celica","Centinela del Cóndor","Cevallos","Chambo","Chilla","Chillanes","Chimbo","Chinchipe","Chone","Chordeleg","Colimes","Colta","Coronel Marcelino Maridueña","Cotacachi","Cuenca","Cumandá","Cuyabeno","Daule","Déleg","Diego de Almagro","Durán","Echeandía","El Carmen","El Chaco","El Empalme","El Guabo","El Pan","El Pangui","El Tambo","Eloy Alfaro","Eloy Alfaro","Esmeraldas","Espejo","Flavio Alfaro","Francisco de Orellana","General Antonio Elizalde","Girón","Gonzanamá","Gualaceo","Gualaquiza","Guamote","Guano","Guaranda","Guayaquil","Huamboya","Huaquillas","Ibarra","Isabela","Isidro Ayora","Jama","Jaramijó","Jipijapa","Junín","La Concordia","La Joya de los Sachas","La Libertad","La Maná","La Troncal","La Unión","La Victoria","Lago Agrio","Las Lajas","Las Naves","Loja","Lomas de Sargentillo","Loreto","Macará","Machachi","Machala","Manta","Marcabelí","Marcovia","María Auxiliadora","Mera","Milagro","Mira","Montalvo","Montecristi","Morona","Nabón","Nangaritza","Naranjal","Naranjito","Napo","Oña","Olmedo","Olmedo","Orellana","Otavalo","Paján","Palenque","Palora","Paltas","Pangua","Panguintza","Pedro Carbo","Pedro Moncayo","Pelileo","Penipe","Piñas","Playas","Pucará","Puebloviejo","Puerto López","Puerto Napo","Putumayo","Puyango","Puyo","Quero","Quevedo","Quijos", "Quito","Quilanga","Quinindé","Riobamba","Rioverde","Rocafuerte","Rumiñahui","Salcedo","Salinas","Salitre","Samborondón","San Cristóbal","San Fernando","San Francisco de Borja","San Juan Bosco","San Lorenzo","San Lorenzo","San Miguel","San Miguel de Los Bancos","San Pablo","San Pedro de Huaca","San Vicente","Santa Ana","Santa Clara","Santa Cruz","Santa Elena","Santa Lucía","Santa Rosa","Santa Rosa","Santa Rosa de Quijos","Santiago","Santo Domingo","Saquisilí","Saraguro","Sevilla de Oro","Shushufindi","Sigchos","Simón Bolívar","Sozoranga","Sucúa","Sucumbíos","Suscal","Taisha","Tena","Tosagua","Tulcán","Valencia","Ventanas","Vinces","Yacuambi","Yaguachi","Yantzaza","Zamora","Zaruma","Zumbahua"]
        this.charges = ["Prefecto", "Alcalde", "Ministro", "Gobernador", "Director", "Empresario", "Profesional", "Académico"]
        this.ticket_given_means_options = ["AME", "CONGOPE", "La Organización", "Ministerio de Turismo"];
        this.person = {};

        this.people_type = [
            {key:"natural", name:"Persona natural"},
            {key:"company", name:"Empresa"},
            {key:"institution", name:"Institución"}
        ]
        this.natural_person = this.people_type[0];

        this.stringsToObject();

    }

    cleanKey(key: string)
    {
        return key.replace("/form/", "").replaceAll("_slashslash_",'/')
    }

    stringsToObject() {
        this.provinces.forEach(string => {
            this.provincesA.push({ label: string });
        });
        this.countryS.forEach(string => {
            this.countryA.push({ label: string });
        });
        this.cantons.forEach(string => {
            this.cities.push({ label: string });
        });
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


    submitForm(){
        this.submitted = true;

        if (this.myForm.valid)
        {
            this.sending = true;
            this.showLoading = true;
            const newPersonObserver: Observer<any> = {
                next: (response: ResponseData) => {

                    if (response.status)
                    {
                        this.showLoading = false;
                        this.router.navigate(['/registro_exitoso']);
                    }
                    else{
                        console.error(response)
                        this.showLoading = false;
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message, life: 3000 });
                    }
                },
                error: (error: any) => {
                    console.error(error);
                    this.showLoading = false;
                    return 1;
                },
                complete: () => {
                    this.submitted = false;
                    this.sending = false;
                    return 0;
                }
            };

            this.messageService.add({ severity: 'info', summary: 'Atención', detail: 'Espere mientras se envia su registro', life: 3000 });
            this.personService.newPerson(this.person).subscribe(newPersonObserver)
        }
        else
        {
            this.messageService.add({ severity: 'error', summary: 'Atención', detail: 'complete los campos requeridos', life: 3000 });
        }

    }

    changePeopleType(option: any)
    {
        this.person.position = ""
        this.person.institution = ""
    }

}
