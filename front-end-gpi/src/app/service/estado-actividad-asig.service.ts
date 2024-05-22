import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EstadoActividadAsig } from '../model/estado-actividad-asig';
import { HttpHeaderApp } from './header';

@Injectable({
  providedIn: 'root'
})
export class EstadoActividadAsigService {

  private baseUrl = environment.baseUrl + '/proyectos/planeacion/actividades-asig/estados';

  constructor(private httpClient: HttpClient, private headers: HttpHeaderApp) { }
  
  private header = this.headers.headerPrivate();

  getEstados(): Observable<EstadoActividadAsig[]> {
    return this.httpClient.get<EstadoActividadAsig[]>(`${this.baseUrl}`, { headers: this.header});
  }

  createEstado(estado: any):Observable<Object> {
    return this.httpClient.post(`${this.baseUrl}`, estado, { headers: this.header});
  }

  updateEstado(id: number, estado: any): Observable<Object> {
    return this.httpClient.put(`${this.baseUrl}/${id}`, estado, { headers: this.header});
  }

  getEstadoById(id: number): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/${id}`, { headers: this.header});
  }

  deleteEstado(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.baseUrl}/${id}`, { headers: this.header});
  }

}
