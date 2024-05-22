import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Empleado } from '../model/empleado';
import { RecursoActividad } from '../model/recurso-actividad';
import { HttpHeaderApp } from './header';

@Injectable({
    providedIn: 'root'
})
export class RecursoActividadService {

    private baseUrl = environment.baseUrl + '/proyectos/recursos/actividades';

    constructor(private httpClient: HttpClient, private headers: HttpHeaderApp) { }

    private header = this.headers.headerPrivate();


    getRecursosActividadList(): Observable<RecursoActividad[]> {
        return this.httpClient.get<RecursoActividad[]>(`${this.baseUrl}`, { headers: this.header });
    }

    createRecursoActividad(recursoActividad: RecursoActividad): Observable<Object> {
        return this.httpClient.post(`${this.baseUrl}`, recursoActividad, { headers: this.header });
    }

    createRecursoActividadList(recursos: RecursoActividad[]): Observable<Object> {
        return this.httpClient.post(`${this.baseUrl}/save-list`, recursos, { headers: this.header });
    }

    getRecursoActividadById(id: number): Observable<RecursoActividad> {
        return this.httpClient.get<RecursoActividad>(`${this.baseUrl}/${id}`, { headers: this.header });
    }

    updateRecursoActividad(id: number, recursoActividad: RecursoActividad): Observable<Object> {
        return this.httpClient.put(`${this.baseUrl}/${id}`, recursoActividad, { headers: this.header });
    }

    deleteRecursoActividad(id: number): Observable<Object> {
        return this.httpClient.delete(`${this.baseUrl}/${id}`, { headers: this.header });
    }

    getNewListByFecha(idEmpleado: number, idActividad: number): Observable<RecursoActividad[]> {
        return this.httpClient.get<any[]>(`${this.baseUrl}/planeacion/${idEmpleado}/${idActividad}`, { headers: this.header });
    }

    findByActividad(idActividad: number): Observable<RecursoActividad[]> {
        return this.httpClient.get<any[]>(`${this.baseUrl}/planeacion/recursos/${idActividad}`, { headers: this.header });
    }

    findByEmpleado(idEmpleado: number): Observable<RecursoActividad[]> {
        return this.httpClient.get<any[]>(`${this.baseUrl}/planeacion/recursos-asignados/${idEmpleado}`, { headers: this.header });
    }

    findEmpleadosAsignados(idActividad: number): Observable<Empleado[]> {
        return this.httpClient.get<Empleado[]>(`${this.baseUrl}/planeacion/recursos-planeados/${idActividad}`, { headers: this.header });
    }

    findByEmpleadoAndActividad(idEmpleado: number, idActividad: number): Observable<RecursoActividad[]> {
        return this.httpClient.get<RecursoActividad[]>(`${this.baseUrl}/planeacion/recursos-asignados/${idEmpleado}/${idActividad}`, { headers: this.header });
    }

    deleteByEmpleadoAndActividad(idEmpleado: number, idActividad: number): Observable<Object> {
        return this.httpClient.delete(`${this.baseUrl}/planeacion/recursos-asignados/${idEmpleado}/${idActividad}`, { headers: this.header });
    }

    existsByActividad(idActividad: number): Observable<boolean> {
        return this.httpClient.get<boolean>(`${this.baseUrl}/planeacion/existe-actividad-asignada/${idActividad}`, { headers: this.header });
    }

}
