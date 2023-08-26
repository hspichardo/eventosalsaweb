import { Benefit } from "./benefit";
import { Person } from "./person";

export interface Certificate {
	id?: number;
	Person?: Person;
	Benefit?: Benefit;

}