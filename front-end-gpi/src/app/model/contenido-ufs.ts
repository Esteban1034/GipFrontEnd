// contenido-ufs.ts

import { Esfuerzo } from "./esfuerzo";
import { EstimacionTiempos } from "./estimacion-ufs";
import { Funcion } from "./funcion";
import { MantenimientoUnidad } from "./mantenimiento-unidad";
import { SubFuncion } from "./subFuncion";
import { Ufs } from "./ufs";

export class ContenidoUfs {
  id: number | null;
  nombreCaso: string;
  porcentajeConstruccion: number;
  porcentajeDiseno: number;
  porcentajePruebas: number;
  totalDiseno: number;
  totalConstruccion: number;
  totalPruebas: number;
  esfuerzo: Esfuerzo;
  subfuncion: SubFuncion;
  ufs: Ufs;
  estimacionUfs: EstimacionTiempos;

  horasConstruccion?: number;
  horasDiseno?: number;
  horas?: number;

  }

  
