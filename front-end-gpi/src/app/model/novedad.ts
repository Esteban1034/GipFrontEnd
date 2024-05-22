import { Causas } from './causas';
import { Empleado } from './empleado';

export class Novedad{
    id:number;
    fechaInicio: Date;
    fechaFin: Date;
    empleado: Empleado;
    causa: Causas;
}