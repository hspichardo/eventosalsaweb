import { FormPerson } from "./formPerson";
import { Ticket } from "./ticket";

export interface Person {
    id?: string;
    identification?: string;
    names?: string;
    surnames?: string;
    province?: string;
    canton?: string;
    position?: string;
    institution?: string;
    phone_number?: string;
    email?: string;
    ticket_given_means?: string;
    registration_form?: FormPerson;
    ticket?: Ticket;
}
