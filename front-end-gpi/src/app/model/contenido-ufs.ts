// contenido-ufs.ts

import { Esfuerzo } from "./esfuerzo";
import { Funcion } from "./funcion";
import { MantenimientoUnidad } from "./mantenimiento-unidad";
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
  funcion: Funcion;
  mantenimientoUnidad: MantenimientoUnidad;
  ufs: null;

  }

  