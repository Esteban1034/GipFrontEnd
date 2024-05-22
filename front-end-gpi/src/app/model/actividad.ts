import { FaseProyecto } from './fase-proyecto';
import { Proyecto } from './proyecto';

export class Actividad{
    id: number;
    actividad: String;
    fase: FaseProyecto;
    base: boolean;
    proyecto: Proyecto;
}