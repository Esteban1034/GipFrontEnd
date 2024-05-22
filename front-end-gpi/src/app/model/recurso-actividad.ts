import { ActividadAsignada } from "./actividad-asignada";
import { Empleado } from "./empleado";

export class RecursoActividad {
    id: number;
    fecha: Date;
    actividad: ActividadAsignada;
    empleado: Empleado;
    checked: boolean;
    asignador: string;
}