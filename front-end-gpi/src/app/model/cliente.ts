import { SectorCliente } from './sector-cliente';
import { EstadoCliente } from './estado-cliente';
import { Empleado } from './empleado';

export class Cliente{
    id: number;
    nit: string;
    nomenclatura: string;
    nombre: string; 
    fechaCreacion: Date;
    estado: EstadoCliente;
    sector: SectorCliente;
    gerenteCuenta: Empleado;
}
