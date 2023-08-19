import { Benefit } from "./benefit";

export interface FormPerson {
	id?: number;
	counter?: number;
	key?: string;
	benefit?: Benefit;
	person?: number;
}