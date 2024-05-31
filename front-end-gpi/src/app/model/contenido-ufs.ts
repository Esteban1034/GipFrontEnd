import { Esfuerzo } from "./esfuerzo";
import { MantenimientoUnidad } from "./mantenimiento-unidad";

export class ContenidoUfs{
    id: number;
    funcion: string;
    nombreCaso: string;
    mantenimientoUnidad: MantenimientoUnidad;
    esfuerzo: Esfuerzo;
    porcentajeDiseno: number;
    porcentajeConstruccion: number;
    porcentajePruebas: number;
    totalDiseno: number;
    totalConstruccion: number;
    totalPruebas: number;
}