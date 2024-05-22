import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProyectoStatusReport } from '../model/project-status.-report';
import { HttpHeaderApp } from './header';
import { ProjectStatusReportComentarios } from '../model/ProjectStatusReportComentarios';
import { Proyecto } from '../Model/proyecto';
import { NotasSemanaPSR } from '../model/notas-semana-psr';

@Injectable({
    providedIn: 'root'
})
export class PSRService {

    private baseUrl = environment.baseUrl + "/projectstatusreports";

    constructor(private httpClient: HttpClient, private headers: HttpHeaderApp) { }

    private header = this.headers.headerPrivate();


    getNotasSemanales(): Observable<NotasSemanaPSR[]> {
        return this.httpClient.get<NotasSemanaPSR[]>(`${this.baseUrl}/getNotasSemanal`, { headers: this.header });
    }

    getNotasSemanalesFechaIFechaF(fechaInicio: string, fechaFin: string): Observable<NotasSemanaPSR[]> {
        return this.httpClient.get<NotasSemanaPSR[]>(`${this.baseUrl}/getNotasSemanalFechaIFechaF/${fechaInicio}/${fechaFin}`, { headers: this.header });
    }

    createNotasSemanal(notas: NotasSemanaPSR): Observable<Object> {
        return this.httpClient.post(`${this.baseUrl}/saveNotaSemanal`, notas, { headers: this.header });
    }

    createObservacionNotaSemanal(notas: NotasSemanaPSR): Observable<Object> {
        return this.httpClient.post(`${this.baseUrl}/saveObservacionNotaSemanal`, notas, { headers: this.header });
    }

    getNotaSemanalesFechaHoy(): Observable<NotasSemanaPSR> {
        return this.httpClient.get<NotasSemanaPSR>(`${this.baseUrl}/getNotaSemanalHoy`, { headers: this.header });
    }


    getPsrList(): Observable<any> {
        return this.httpClient.get<ProyectoStatusReport[]>(`${this.baseUrl}`, { headers: this.header });
    }

    FindPsrByFeachaCreacionAndCodigoProyecto(fechaCreacionPsr:any, codigoProyecto:any): Observable<ProjectStatusReportComentarios> {
        return this.httpClient.get<ProjectStatusReportComentarios>(`${this.baseUrl}/findPsrByFeachaCreacionAndCodigoProyecto/${fechaCreacionPsr}/${codigoProyecto}`, { headers: this.header });
    }

    getProjectsForPsr(): Observable<Proyecto[]> {
        return this.httpClient.get<Proyecto[]>(`${this.baseUrl}/getProjectsForPsr`, { headers: this.header });
    }

    getProyectosForPsrByFechaInicioFechaFin(fechaInicio: string, fechaFin: string): Observable<Proyecto[]> {
        return this.httpClient.get<Proyecto[]>(`${this.baseUrl}/getProjectsForPsrFechaInicioFechaFin/${fechaInicio}/${fechaFin}`, { headers: this.header });
    }

    getProjectsForPsrByLiderAsignado(idEmpleado: number): Observable<Proyecto[]> {
        return this.httpClient.get<Proyecto[]>(`${this.baseUrl}/getProjectsByLiderAsignadoForPsr/${idEmpleado}`, { headers: this.header });
    }

    getProyectosForPsrByLiderFechaInicioFechaFin(fechaInicio: string, fechaFin: string, idEmpleado: number): Observable<Proyecto[]> {
        return this.httpClient.get<Proyecto[]>(`${this.baseUrl}/getProjectsByLiderAsignadoForPsr/searchBetweenFechaInicioAndFechaFin/${fechaInicio}/${fechaFin}/${idEmpleado}`, { headers: this.header });
    }

    createPsr(psr: ProyectoStatusReport[]): Observable<Object> {
        return this.httpClient.post(`${this.baseUrl}`, psr, { headers: this.header });
    }

    createPsrWithComment(psr: any[]): Observable<Object> {
        return this.httpClient.post(`${this.baseUrl}/saveWithComment`, psr, { headers: this.header });
    }
    
    getPsrListBetweenFechaInicioAndFechaFin(fechaInicio: string, fechaFin: string): Observable<ProyectoStatusReport[]> {
        return this.httpClient.get<ProyectoStatusReport[]>(`${this.baseUrl}/searchBetweenFechaInicioAndFechaFin/${fechaInicio}/${fechaFin}`, { headers: this.header });
    }
}