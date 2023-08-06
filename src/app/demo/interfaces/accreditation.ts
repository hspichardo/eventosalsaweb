import { Benefit } from "./benefit";
import { EventEntity } from "./eventEntity";

export interface Accreditation {
    id?: number;
    description?: string;
    cost?: number;
    parentAcred?: Accreditation;
    childrenAcreds?: Accreditation[];
    benefits?: Benefit[];
    event?: EventEntity;
}