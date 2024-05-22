import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpHeaderApp } from './header';
import { Observable } from 'rxjs';
import { ReporteTiempoEmpleado } from "../model/reporte-tiempo-empleado";
import { Empleado } from "../model/empleado";
import { ReporteFacturacionCliente } from "../model/reporte-facturacion-cliente";
import { ReporteTiempoCliente } from "../model/reporte-tiempo-cliente";
import { ReporteProyectoRecurso } from "../model/reporte-proyecto-recurso";
import { ReporteTiempo } from "../Model/reporte-tiempo";

@Injectable({
    providedIn: 'root'
})
export class ReporteAppService {

    private baseUrl = environment.baseUrl + "/reportes";
    private header = this.headers.headerPrivate();

    constructor(private httpClient: HttpClient, private headers: HttpHeaderApp) {

    }
    
    findAllReportesTiemposReportados(fechaInicio:string, fechaFin:string, empleados:string): Observable<ReporteTiempoEmpleado[]> {
        return this.httpClient.get<ReporteTiempoEmpleado[]>(`${this.baseUrl}/tiempos-reportados/${fechaInicio}/${fechaFin}/${empleados}`, {headers: this.header});
    }

    findAllReportesFacturacionCliente(fechaInicio:string, fechaFin:string, clientes:string): Observable<ReporteFacturacionCliente[]> {
        return this.httpClient.get<ReporteFacturacionCliente[]>(`${this.baseUrl}/clientes/facturacion/${fechaInicio}/${fechaFin}/${clientes}`, {headers: this.header});
    }

    findAllReportesTiemposClientes(fechaInicio:string, fechaFin:string, clientes:string): Observable<ReporteTiempoCliente[]> {
        return this.httpClient.get<ReporteTiempoCliente[]>(`${this.baseUrl}/clientes/tiempos-reportados/${fechaInicio}/${fechaFin}/${clientes}`, {headers: this.header});
    }

    getReportesProyectoRecurso(fechaInicio:string, fechaFin:string, proyectos:string): Observable<ReporteProyectoRecurso[]> {
        return this.httpClient.get<ReporteProyectoRecurso[]>(`${this.baseUrl}/proyectos/tiempos-reportados/${fechaInicio}/${fechaFin}/${proyectos}`, {headers: this.header});
    }

    getEmpleadosPendientesReporteTiempo(fechaInicio:String, fechaFin:String): Observable<ReporteTiempo[]> {
        return this.httpClient.get<ReporteTiempo[]>(`${this.baseUrl}/tiempos-reportados/empleados-pendientes/${fechaInicio}/${fechaFin}`);
    }
    

}