import { Benefit } from "./benefit";

export interface FormPerson {
	id?: number;
	counter?: number;
	key?: string;
	mod_key?: string;
	benefit?: Benefit;
	people?: [];
}