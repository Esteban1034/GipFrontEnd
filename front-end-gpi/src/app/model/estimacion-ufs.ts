import { ActividadesComplementarias } from "./actividades-complementarias";
import { Empleado } from "./empleado";
import { EtapaProyecto } from "./etapa-proyecto";
import { Modelo } from "./modelo";
import { Proyecto } from "./proyecto";
import { TipoProyecto } from "./tipo-proyecto";
import { Ufs } from "./ufs";
export class EstimacionTiempos {
  id: number;
  proyecto: Proyecto;
  ufs: Ufs;
  actividadesComplementarias: ActividadesComplementarias;
  modelo: Modelo;
  fechaCreacion: Date;
  recurso: Empleado;
  etapaProyecto: EtapaProyecto;
  tipoProyecto: TipoProyecto;
}

