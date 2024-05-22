import { EstadoFactura } from './estado-factura';
import { Proyecto } from './proyecto';

export class Facturacion{
    id: number;
    porcentaje: number;
    fechaPlaneada: Date;
    fechaPago: Date;
    valorPagar: number;
    valorPagado: number;
    estado: EstadoFactura;
    proyecto: Proyecto;
    precio: number;
}