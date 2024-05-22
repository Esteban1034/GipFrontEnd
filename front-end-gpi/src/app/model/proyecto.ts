import { TipoProyecto } from './tipo-proyecto';
import { EtapaProyecto } from './etapa-proyecto';
import { ComponenteDesarrollo } from './componente-desarrollo';
import { Cliente } from './cliente';
import { EstadoPropuesta } from './estado-propuesta';
import { EstadoProyecto } from './estado-proyecto';
import { Empleado } from './empleado';

export class Proyecto {
    id: number;
    codigo: string;
    costo: number;
    nombre: string;
    descripcion: string;
    fechaCreacion: Date;
    fechaAprobacion: Date;
    fechaInicio: Date;
    fechaFin: Date;
    horasPlaneadas: number;
    horasPropuesta: number;
    directorClient: string;
    tipo: TipoProyecto;
    etapa: EtapaProyecto;
    componente: ComponenteDesarrollo;
    cliente: Cliente;
    estadoPropuesta: EstadoPropuesta;
    estadoProyecto: EstadoProyecto;
    directorIts: Empleado;
    lider: Empleado;
    interno: boolean;
    creador: string;
}