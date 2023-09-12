import { Benefit } from "./benefit";
import { Person } from "./person";

export interface Certificate {
	id?: number;
	person?: Person;
	benefit?: Benefit;

}