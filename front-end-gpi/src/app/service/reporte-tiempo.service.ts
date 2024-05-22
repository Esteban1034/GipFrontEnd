import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { environment } from "src/environments/environment";
import { ReporteTiempo } from "../model/reporte-tiempo";
import { HttpHeaderApp } from "./header";
import { NumberFormat } from "xlsx";

@Injectable({
    providedIn: "root",
})
export class ReporteTiempoService {
    private baseUrl = environment.baseUrl + "/proyectos/reporte-tiempo/reportes";

    constructor(private httpClient: HttpClient, private headers: HttpHeaderApp) { }

    private header = this.headers.headerPrivate();

    getReportesTiempoList(): Observable<ReporteTiempo[]> {
        return this.httpClient.get<any[]>(`${this.baseUrl}`, {
            headers: this.header,
        });
    }

    getReportesTiempoListUltimosDosMeses(): Observable<ReporteTiempo[]> {
        return this.httpClient.get<any[]>(`${this.baseUrl}/ultimos-dos-meses`, {
            headers: this.header,
        });
    }

    getReportesTiempoPendienteAprobacion(): Observable<ReporteTiempo[]> {
        return this.httpClient.get<any[]>(`${this.baseUrl}/pendiente-aprobacion`, {
            headers: this.header,
        });
    }

    getReportesTiempoListPaginado(
        page: number,
        size: number
    ): Observable<ReporteTiempo[]> {
        return this.httpClient.get<any[]>(
            `${this.baseUrl}/paginado?page=${page}&size=${size}`,
            { headers: this.header }
        );
    }

    enviar(reporte: ReporteTiempo): Observable<Object> {
        return this.httpClient.post(`${this.baseUrl}/enviar`, reporte, {
            headers: this.header,
        });
    }

    enviarProyectoInt(reporte: ReporteTiempo): Observable<Object> {
        return this.httpClient.post(`${this.baseUrl}/enviar-int`, reporte, {
            headers: this.header,
        });
    }

    aprobar(id: number, fechaA: Date, aprobador: number): Observable<Object> {
        return this.httpClient.put(
            `${this.baseUrl}/aprobar/${id}/${fechaA}/${aprobador}`,
            { headers: this.header }
        );
    }

    devolver(id: number, reporte: ReporteTiempo): Observable<Object> {
        return this.httpClient.put(`${this.baseUrl}/devolver/${id}`, reporte, {
            headers: this.header,
        });
    }

    reenviar(id: number, reporte: ReporteTiempo): Observable<Object> {
        return this.httpClient.put(`${this.baseUrl}/reenviar/${id}`, reporte, {
            headers: this.header,
        });
    }

    getReporteTiempoById(id: number): Observable<ReporteTiempo> {
        return this.httpClient.get<ReporteTiempo>(`${this.baseUrl}/${id}`, {
            headers: this.header,
        });
    }

    deleteReporteTiempo(id: number): Observable<Object> {
        return this.httpClient.delete(`${this.baseUrl}/${id}`, {
            headers: this.header,
        });
    }

    findByProyecto(idProyecto: number): Observable<ReporteTiempo[]> {
        return this.httpClient.get<ReporteTiempo[]>(
            `${this.baseUrl}/search/proyecto/${idProyecto}`,
            { headers: this.header }
        );
    }

    findByEstado(idEstado: number): Observable<ReporteTiempo[]> {
        return this.httpClient.get<ReporteTiempo[]>(
            `${this.baseUrl}/search/estado/${idEstado}`,
            { headers: this.header }
        );
    }

    findByProyectoAndEstado(
        idProyecto: number,
        idEstado: number
    ): Observable<ReporteTiempo[]> {
        return this.httpClient.get<ReporteTiempo[]>(
            `${this.baseUrl}/search/proyecto-estado/${idProyecto}/${idEstado}`,
            { headers: this.header }
        );
    }

    findByEmpleadoAndEstado( idEmpleado: number,idEstado: number): Observable<ReporteTiempo[]> {
        return this.httpClient.get<ReporteTiempo[]>(`${this.baseUrl}/search/empleado-estado/${idEmpleado}/${idEstado}`,{ headers: this.header });
    }

    findByMesActualAndEmpleado( idEmpleado: number): Observable<ReporteTiempo[]> {
        return this.httpClient.get<ReporteTiempo[]>(`${this.baseUrl}/search/mes-actual-empleado/${idEmpleado}`,{ headers: this.header });
    }

    findHorasDiaByFechaAndEmpleado( idEmpleado: number, fecha: string): Observable<number> {
        return this.httpClient.get<number>(`${this.baseUrl}/search/horas-empleado-dia/${idEmpleado}/${fecha}`,{ headers: this.header });
    }

    findPendingReportes(idEmpleado: number): Observable<ReporteTiempo[]> {
        return this.httpClient.get<ReporteTiempo[]>(
            `${this.baseUrl}/pendientes/empleado/${idEmpleado}`,
            { headers: this.header }
        );
    }

    findByActividad(idActividad: number): Observable<ReporteTiempo[]> {
        return this.httpClient.get<ReporteTiempo[]>(
            `${this.baseUrl}/find-by-actividad/${idActividad}`,
            { headers: this.header }
        );
    }

    findByEmpleado(idEmpleado: number): Observable<ReporteTiempo[]> {
        return this.httpClient.get<ReporteTiempo[]>(
            `${this.baseUrl}/find-by-empleado/${idEmpleado}`,
            { headers: this.header }
        );
    }

    findByEmpleados(empleados: string): Observable<ReporteTiempo[]> {
        return this.httpClient.get<ReporteTiempo[]>(
            `${this.baseUrl}/find-by-empleados/${empleados}`,
            { headers: this.header }
        );
    }

    findByProyectoInt(): Observable<ReporteTiempo[]> {
        return this.httpClient.get<ReporteTiempo[]>(
            `${this.baseUrl}/find-by-proyecto-int`,
            { headers: this.header }
        );
    }

    findByLider(idLider: number): Observable<ReporteTiempo[]> {
        return this.httpClient.get<ReporteTiempo[]>(
            `${this.baseUrl}/find-by-lider/${idLider}`,
            { headers: this.header }
        );
    }

    findByProyectoAndRecurso(
        idProyecto: number,
        idRecurso: number
    ): Observable<ReporteTiempo[]> {
        return this.httpClient.get<ReporteTiempo[]>(
            `${this.baseUrl}/search/proyecto-empleado/${idProyecto}/${idRecurso}`,
            { headers: this.header }
        );
    }

    findByProyectoAndEstadoAndRecurso(
        idProyecto: number,
        idEstado: number,
        idRecurso: number,
    ): Observable<ReporteTiempo[]> {
        return this.httpClient.get<ReporteTiempo[]>(
            `${this.baseUrl}/search/proyecto-estado-empleado/${idProyecto}/${idEstado}/${idRecurso}`,
            { headers: this.header }
        );
    }

    getRecursosAprobacionTiempos(
        fechaInicio: string,
        fechaFin: string,
        idRecurso: number
    ): Observable<ReporteTiempo[]> {
        return this.httpClient.get<ReporteTiempo[]>(
            `${this.baseUrl}/searchByEmpleado/${fechaInicio}/${fechaFin}/${idRecurso}`
        );
    }

    findRecursosNombres(id: number): Observable<ReporteTiempo[]> {
        return this.httpClient.get<ReporteTiempo[]>(
            `${this.baseUrl}/searchByRecurso/${id}`);
    }

    getReportesFiltradosPorEmpleados(recursosAdd: number[]): Observable<ReporteTiempo[]> {
        return this.httpClient.get<ReporteTiempo[]>(
            `${this.baseUrl}/empleado?recursosAdd=${recursosAdd.join(',')}`, 
            { headers: this.header }); 
      }
}
