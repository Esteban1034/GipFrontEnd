import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Empleado } from '../model/empleado';
import { HttpHeaderApp } from './header';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService{

    private baseUrl = environment.baseUrl + "/empleados";

    constructor (private httpClient: HttpClient, private headers: HttpHeaderApp) { }
  
    private header = this.headers.headerPrivate();

    getEmpleadosList(): Observable<Empleado[]>{
        return this.httpClient.get<any[]>(`${this.baseUrl}`, { headers: this.header});
    }

    createEmpleado(empleado: Empleado): Observable<Object>{
        return this.httpClient.post(`${this.baseUrl}`, empleado, { headers: this.header});
    }

    getEmpleadoById(id: number): Observable<Empleado> {
        return this.httpClient.get<Empleado>(`${this.baseUrl}/${id}`, { headers: this.header});
    }

    updateEmpleado(id: number, empleado: Empleado): Observable<Object> {
        return this.httpClient.put(`${this.baseUrl}/${id}`, empleado, { headers: this.header});
    }
    
    deleteEmpleado(id:number): Observable<Object> {
        console.log(id);
        return this.httpClient.delete(`${this.baseUrl}/${id}`, { headers: this.header});
    }

    getDirectores(): Observable<Empleado[]> {
      return this.httpClient.get<Empleado[]>(`${this.baseUrl}/directores`, { headers: this.header});
    }

    getDirectorCli(): Observable<Empleado[]> {
        return this.httpClient.get<Empleado[]>(`${this.baseUrl}/directores-cli`, { headers: this.header});
    }

    getDirectorIts(): Observable<Empleado[]> {
        return this.httpClient.get<Empleado[]>(`${this.baseUrl}/directores-its`, { headers: this.header});
    }

    getLideres(): Observable<Empleado[]> {
        return this.httpClient.get<Empleado[]>(`${this.baseUrl}/lider`, { headers: this.header});
    }

    getAvailableEmpleados(id: number): Observable<Empleado[]> {
        return this.httpClient.get<Empleado[]>(`${this.baseUrl}/planeacion/disponibles/${id}`, { headers: this.header});
    }

    searchRecursosByEspecialidad(idActividad: number, idEspecialidad: number): Observable<Empleado[]> {
        return this.httpClient.get<Empleado[]>(`${this.baseUrl}/search/especialidad/${idActividad}/${idEspecialidad}`, { headers: this.header});
    }

    searchRecursosByNombre(idActividad: number, nombre: string): Observable<Empleado[]> {
        return this.httpClient.get<Empleado[]>(`${this.baseUrl}/search/nombre-containing/${idActividad}/${nombre}`, { headers: this.header});
    }

    searchRecursoByName(nombre: string): Observable<Empleado[]>{
        return this.httpClient.get<Empleado[]>(`${this.baseUrl}/search/nombre-recurso/${nombre}`, {headers: this.header});
    }
    getDirectoresPEstimacion(): Observable<Empleado[]> {
        return this.httpClient.get<Empleado[]>(`${this.baseUrl}/estimacion/`, { headers: this.header});
    }
}