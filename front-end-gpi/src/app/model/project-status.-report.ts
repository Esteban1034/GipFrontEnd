import { Cliente } from './cliente';
import { Empleado } from './empleado';
import { Proyecto } from './proyecto';

export class ProyectoStatusReport {
    id: number;
    codigo: string;
    nombre: string;
    descripcion: string;
    fechaCreacionPsr: Date;
    cliente: Cliente;
    nombreCliente: string;
    empleado: Empleado;
    estado: string;
    proyecto: Proyecto;
    porcentajeAvanceEsperado: number;
    porcentajeAvanceReal: number;
    porcentajeDesviacion: number;
    horasAprobadas: number;
    horasEjecutadas: number;
    horasReales: number;

}