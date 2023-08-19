import { Accreditation } from "./accreditation";
import { Client } from "./client";

export interface ClientAccreditation {
	id?: number;
	quantity?: number;
	client?: Client;
	accreditation?: Accreditation;
	formsGenerated?: boolean;

}