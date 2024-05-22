import { EstadoActividadAsig } from './estado-actividad-asig';
import { Actividad } from './actividad';
import { Proyecto } from './proyecto';

export class ActividadAsignada {
    id: number;
    actividad: Actividad;
    fechaInicio: Date;
    fechaFin: Date;
    estado: EstadoActividadAsig;
    proyecto: Proyecto;
    recursos?: boolean;
    porcentajeAvance : number;
}