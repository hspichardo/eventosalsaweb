import {Component, OnInit} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';

@Component({
    templateUrl: './form.component.html',
    providers: [MessageService, ConfirmationService],
    styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  
    name: string;
    identification: string;

    constructor(private messageService: MessageService) {

    }
  
    ngOnInit() {

    }

}
