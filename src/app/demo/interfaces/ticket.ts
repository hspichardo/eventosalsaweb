import { Benefit } from "./benefit";
import { Person } from "./person";

export interface Ticket {
	id?: number;
	invitation_qr?: string;
	contact_qr?: string;
	person?: Person;
	benefit?: Benefit;
}