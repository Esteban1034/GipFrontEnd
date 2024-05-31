import { ActividadesComplementarias } from "./actividades-complementarias";
import { Empleado } from "./empleado";
import { Modelo } from "./modelo";
import { Proyecto } from "./proyecto";
import { Ufs } from "./ufs";


export class EstimacionTiempos {
  id: number;
  proyecto: Proyecto;
  ufs: Ufs;
  actividadesComplementarias: ActividadesComplementarias;
  modelo: Modelo;
  fecha: Date;
  empleado: Empleado;
}
