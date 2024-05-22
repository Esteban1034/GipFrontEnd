import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Actividad } from '../Model/actividad';
import { HttpHeaderApp } from './header';

@Injectable({
  providedIn: 'root'
})
export class ActividadService {

  private baseUrl = environment.baseUrl + '/proyectos/actividades';

  constructor(private httpClient: HttpClient, private headers: HttpHeaderApp) { }
  
  private header = this.headers.headerPrivate();

  getActividades(): Observable<Actividad[]> {
    return this.httpClient.get<Actividad[]>(`${this.baseUrl}`, { headers: this.header});
  }

  createActividad(actividad: Actividad): Observable<Object> {
    return this.httpClient.post(`${this.baseUrl}`, actividad, { headers: this.header});
  }

  updateActividad(id: number, actividad: Actividad): Observable<Object> {
    return this.httpClient.put(`${this.baseUrl}/${id}`, actividad, { headers: this.header});
  }

  getActividadById(id: number): Observable<Actividad> {
    return this.httpClient.get<Actividad>(`${this.baseUrl}/${id}`, { headers: this.header});
  }

  deleteActividad(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.baseUrl}/${id}`, { headers: this.header});
  }
  
  findByProyectoAndFaseAndBase(idProyecto: number, idFase: number): Observable<Actividad[]> {
    return this.httpClient.get<Actividad[]>(`${this.baseUrl}/proyecto/${idProyecto}/${idFase}`, { headers: this.header});
  }

  findByFase(idFase: number) {
    return this.httpClient.get<Actividad[]>(`${this.baseUrl}/find-by-fase/${idFase}`, { headers: this.header});
  }

}
