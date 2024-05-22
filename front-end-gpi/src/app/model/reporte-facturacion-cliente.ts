export class ReporteFacturacionCliente {
    cliente:string;
    proyecto:string;
    descripcion : String;
    nPagos:number;
    porcentaje:number;
    precio:number;
    fechaPlaneada:string;
    estado:string;
    fechaPago:string;
    valorAprobado:number;
    valorCobrado:number;
    facturasPagas:number;
    facturasPendientes:number;
}

export class ReporteFacturacionClienteResumido {
    cliente:string;
    proyecto:string;
    descripcion : String;
    nPagos:number;
    facturasPagas:number;
    facturasPendientes:number;
    valorAprobado:number;
    valorCobrado:number;
}