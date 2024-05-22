import { EstadoReporteTiempo } from './estado-reporte-tiempo';
import { Proyecto } from './proyecto';
import { Empleado } from './empleado';
import { ActividadAsignada } from './actividad-asignada';

export class ReporteTiempo{
    id: number;
    fecha: Date;
    horas:number;
    fechaA: Date;
    aprobador:number;
    aprobadorName: String;
    justificacion: string;
    estado: EstadoReporteTiempo;
    proyecto: Proyecto;
    empleado: Empleado;
    actividad: ActividadAsignada;
    asignador: string;
    checked:boolean;
}