import { Empleado } from "./empleado";

export class NotasSemanaPSR{
    id: number;
    comentario: string = "";
    fechaCreacion: Date;
    empleado: Empleado = new Empleado();
    esObservacion:boolean = false;
    fechaObservacion: Date;
}
