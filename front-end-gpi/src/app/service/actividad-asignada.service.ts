import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ActividadAsignada } from '../Model/actividad-asignada';
import { HttpHeaderApp } from './header';

@Injectable({
  providedIn: 'root'
})
export class ActividadAsignadaService {

  private baseUrl = environment.baseUrl + '/proyectos/planeacion/actividades-asig';

  constructor(private httpClient: HttpClient, private headers: HttpHeaderApp) { }
  
  private header = this.headers.headerPrivate();

  getActividades(): Observable<ActividadAsignada[]> {
    return this.httpClient.get<ActividadAsignada[]>(`${this.baseUrl}`, { headers: this.header});
  }

  createActividad(actividad: ActividadAsignada): Observable<Object> {
    return this.httpClient.post(`${this.baseUrl}`, actividad, { headers: this.header});
  }

  updateActividad(id: number, actividad: ActividadAsignada): Observable<Object> {
    return this.httpClient.put(`${this.baseUrl}/${id}`, actividad, { headers: this.header});
  }

  deleteActividad(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.baseUrl}/${id}`, { headers: this.header});
  }

  getActividadById(id: number): Observable<ActividadAsignada> {
    return this.httpClient.get<ActividadAsignada>(`${this.baseUrl}/${id}`, { headers: this.header});
  }

  findByProyecto(id: number): Observable<ActividadAsignada[]> { 
    return this.httpClient.get<ActividadAsignada[]>(`${this.baseUrl}/proyecto/${id}`, { headers: this.header});
  }

  findByProyectoInt(id: number): Observable<ActividadAsignada[]> { 
    return this.httpClient.get<ActividadAsignada[]>(`${this.baseUrl}/proyecto-int/${id}`, { headers: this.header});
  }

  findByFase(idProyecto: number, idFase: number): Observable<ActividadAsignada[]> {
    return this.httpClient.get<ActividadAsignada[]>(`${this.baseUrl}/fase/${idProyecto}/${idFase}`, { headers: this.header});
  }

  findByActividad(idActividad: number) {
    return this.httpClient.get<ActividadAsignada[]>(`${this.baseUrl}/find-by-actividad/${idActividad}`, { headers: this.header});
  }

}
