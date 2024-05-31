import { ActividadesEstimacion } from "./actividades-estimacion";
import { AnalisisDiseno } from "./analisis-diseno";
import { Elaboracion } from "./elaboracion";
import { Propuesta } from "./propuesta";
import { Transicion } from "./transicion";

export class ActividadesComplementarias{
    id: number;
    actividadEstimacion: ActividadesEstimacion;
    propuesta: Propuesta;
    analisiDiseno: AnalisisDiseno;
    elaboracion: Elaboracion;
    transicion: Transicion;
}