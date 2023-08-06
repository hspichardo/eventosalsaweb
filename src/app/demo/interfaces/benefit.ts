import { Accreditation } from "./accreditation";
import { EventEntity } from "./eventEntity";

export interface Benefit {
    id?: number;
    description?: string;
    quantity?: number;
    accreditation?: Accreditation;
}