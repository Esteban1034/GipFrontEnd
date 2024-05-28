import { Cliente } from "./cliente";
import { EstadoPropuesta } from "./estado-propuesta";
import { Proyecto } from "./proyecto";


export class EstimacionTiempos {
  id: number;
  proyecto: Proyecto;
  cliente: Cliente;
  estadoPropuesta: EstadoPropuesta;
}
