import { Empleado } from './empleado';
import { ProyectoStatusReport } from './project-status.-report';
import { Proyecto } from './proyecto';

export class PSRStatus{
    id: number;
    psrproyecto: ProyectoStatusReport;
    empleado: Empleado;
    comentario: string;
    fechaCreacionStatus: Date;
    comentarioGerencia: Boolean;
    esComentarioMismoDia: Boolean;
}
