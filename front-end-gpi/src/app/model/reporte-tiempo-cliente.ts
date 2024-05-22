import { Proyecto } from "./proyecto";

export class ReporteTiempoCliente {
    cliente:string;
	proyecto:String;
    proyectoB:Proyecto;
    interno:String;
	fechaInicio:string;
	fechaFin:string;
	horasCotizadas:number;
	horasConsumidas:number;
	porcentajeAvance:number;
}