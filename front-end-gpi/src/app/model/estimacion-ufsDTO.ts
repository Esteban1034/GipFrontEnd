import { ActividadesComplementarias } from "./actividades-complementarias";
import { Empleado } from "./empleado";
import { EtapaProyecto } from "./etapa-proyecto";
import { Modelo } from "./modelo";
import { Proyecto } from "./proyecto";
import { TipoProyecto } from "./tipo-proyecto";

export interface EstimacionUfsDTO {
    ufId: number;
    estimacionUfs: {
      fechaCreacion: Date;
      recurso: Empleado;
      modelo: Modelo;
      proyecto: Proyecto;
      etapaProyecto: EtapaProyecto;
      tipoProyecto: TipoProyecto;
      actividadesComplementarias: ActividadesComplementarias;
    };
  }
  