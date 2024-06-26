import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Proyecto } from '../Model/proyecto';
import { HttpHeaderApp } from './header';

@Injectable({
    providedIn: 'root'
})
export class ProyectoService {

    private baseUrl = environment.baseUrl + "/proyectos";

    constructor(private httpClient: HttpClient, private headers: HttpHeaderApp) { }

    private header = this.headers.headerPrivate();

    getProyectosList(): Observable<Proyecto[]> {
        return this.httpClient.get<Proyecto[]>(`${this.baseUrl}`, { headers: this.header });
    }

    getProyectosListByFechaInicioFechaFin(fechaInicio: string, fechaFin: string): Observable<Proyecto[]> {
        return this.httpClient.get<Proyecto[]>(`${this.baseUrl}/searchBetweenFechaInicioAndFechaFin/${fechaInicio}/${fechaFin}`, { headers: this.header });
    }

    getProyectosListByLiderFechaInicioFechaFin(fechaInicio: string, fechaFin: string, idEmpleado: number): Observable<Proyecto[]> {
        return this.httpClient.get<Proyecto[]>(`${this.baseUrl}/asignados/searchBetweenFechaInicioAndFechaFin/${fechaInicio}/${fechaFin}/${idEmpleado}`, { headers: this.header });
    }

    createProyecto(proyecto: Proyecto): Observable<Object> {
        return this.httpClient.post(`${this.baseUrl}`, proyecto, { headers: this.header });
    }

    getProyectoById(id: number): Observable<Proyecto> {
        return this.httpClient.get<Proyecto>(`${this.baseUrl}/${id}`, { headers: this.header });
    }

    updateProyecto(id: number, proyecto: Proyecto,creator: number): Observable<Object> {
        return this.httpClient.put(`${this.baseUrl}/${id}/${creator}`, proyecto, { headers: this.header });
    }

    deleteProyecto(id: number): Observable<Object> {
        return this.httpClient.delete(`${this.baseUrl}/${id}`, { headers: this.header });
    }

    findByLiderAsignado(idEmpleado: number): Observable<Proyecto[]> {
        return this.httpClient.get<Proyecto[]>(`${this.baseUrl}/asignados/${idEmpleado}`, { headers: this.header });
    }

    findProyectosForReporteTiempo(idEmpleado: number): Observable<Proyecto[]> {
        return this.httpClient.get<Proyecto[]>(`${this.baseUrl}/reporte-tiempo/disponibles/${idEmpleado}`, { headers: this.header });
    }

    findByCliente(idCliente: number): Observable<Proyecto[]> {
        return this.httpClient.get<Proyecto[]>(`${this.baseUrl}/proyectos-by-cliente/${idCliente}`, { headers: this.header });
    }

    findByCodigo(codigo: string): Observable<Proyecto[]> {
        return this.httpClient.get<Proyecto[]>(`${this.baseUrl}/proyectos-by-codigo/${codigo}`, { headers: this.header });
    }

    findByComponente(idComponente: number): Observable<Proyecto[]> {
        return this.httpClient.get<Proyecto[]>(`${this.baseUrl}/proyectos-by-componente/${idComponente}`, { headers: this.header });
    }

    findByCodigoAndCliente(codigo: string, idCliente: number): Observable<Proyecto[]> {
        return this.httpClient.get<Proyecto[]>(`${this.baseUrl}/proyectos-by-codigo-cliente/${codigo}/${idCliente}`, { headers: this.header });
    }

    findByClienteIdConEtapaPRP(idCliente: number): Observable<Proyecto[]> {
        return this.httpClient.get<Proyecto[]>(`${this.baseUrl}/${idCliente}/etapa-prp`, { headers: this.header });
    }

    findByCodigoAndComponente(codigo: string, idComponente: number): Observable<Proyecto[]> {
        return this.httpClient.get<Proyecto[]>(`${this.baseUrl}/proyectos-by-codigo-componente/${codigo}/${idComponente}`, { headers: this.header });
    }

    findByCodigoAndClienteAndComponente(codigo: string, idCliente: number, idComponente: number): Observable<Proyecto[]> {
        return this.httpClient.get<Proyecto[]>(`${this.baseUrl}/proyectos-by-codigo-cliente-componente/${codigo}/${idCliente}/${idComponente}`, { headers: this.header });
    }

    findByClienteAndDirectorCliAndComponente(idCliente: number, idDirectorCli: number, idComponente: number): Observable<Proyecto[]> {
        return this.httpClient.get<Proyecto[]>(`${this.baseUrl}/proyectos-by-cliente-directorCli-componente/${idCliente}/${idDirectorCli}/${idComponente}`, { headers: this.header });
    }

    findByDirectorCliAndComponente(idDirectorCli: number, idComponente: number): Observable<Proyecto[]> {
        return this.httpClient.get<Proyecto[]>(`${this.baseUrl}/proyectos-by-directorCli-componente/${idDirectorCli}/${idComponente}`, { headers: this.header });
    }

    findByDirectorCliAndCliente(idDirectorCli: number, idCliente: number): Observable<Proyecto[]> {
        return this.httpClient.get<Proyecto[]>(`${this.baseUrl}/proyectos-by-directorCli-cliente/${idDirectorCli}/${idCliente}`, { headers: this.header });
    }

    findByComponenteAndCliente(idComponente: number, idCliente: number): Observable<Proyecto[]> {
        return this.httpClient.get<Proyecto[]>(`${this.baseUrl}/proyectos-by-componente-cliente/${idComponente}/${idCliente}`, { headers: this.header });
    }

    saveProyectoInt(proyecto: Proyecto): Observable<Object> {
        return this.httpClient.post(`${this.baseUrl}/internos`, proyecto, { headers: this.header });
    }

    updateProyectoInt(idProyecto:number, proyecto:Proyecto):Observable<Object> {
        return this.httpClient.put(`${this.baseUrl}/internos/${idProyecto}`, proyecto, { headers: this.header });
    }

    deleteProyectoInt(id:number):Observable<Object> {
        return this.httpClient.delete(`${this.baseUrl}/internos/${id}`, { headers: this.header });
    }
    findByEtapa(id: number): Observable<Proyecto[]> {
        return this.httpClient.get<Proyecto[]>(`${this.baseUrl}/proyectos-by-Etapa/${id}`, { headers: this.header });
    }

}