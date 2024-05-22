import { EspecialidadRecurso } from "./especialidad-recurso";
import { PerfilRecurso } from "./perfil-recurso";

export class ParametriaRecursosMatrizTiempo {
    id: number;
    especialidad: EspecialidadRecurso;
    perfil: PerfilRecurso;
    tarifaHora: number;
    tarifaMensual: number;
    descripcion: string;
}