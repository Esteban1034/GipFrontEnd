import { Esfuerzo } from "./esfuerzo";
import { Funcion } from "./funcion";
import { MantenimientoUnidad } from "./mantenimiento-unidad";

export class ContenidoUfs{
    id: number;
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
 
  

  
}