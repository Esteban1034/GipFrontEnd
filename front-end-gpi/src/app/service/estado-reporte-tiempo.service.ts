import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EstadoReporteTiempo } from '../Model/estado-reporte-tiempo';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpHeaderApp } from './header';

@Injectable({
  providedIn: 'root'
})
export class EstadoReporteTiempoService {

  private baseUrl = environment.baseUrl +'/proyectos/reporte-tiempo/estados';

  constructor(private HttpClient: HttpClient, private headers: HttpHeaderApp) { }
  
  private header = this.headers.headerPrivate();
  
  getEstadosList(): Observable<EstadoReporteTiempo[]>{
    return this.HttpClient.get<any[]>(`${this.baseUrl}`, { headers: this.header});
  }

  createEstado(estado: EstadoReporteTiempo): Observable<Object>{
    return this.HttpClient.post(`${this.baseUrl}`,estado, { headers: this.header});
  }

  getEstadoById(id: number): Observable<EstadoReporteTiempo>{
    return this.HttpClient.get<EstadoReporteTiempo>(`${this.baseUrl}/${id}`, { headers: this.header});
  }

  updateEstado(id: number, estado: EstadoReporteTiempo): Observable<Object>{
    return this.HttpClient.put(`${this.baseUrl}/${id}`, estado, { headers: this.header});
  }

  deleteEstado(id: number): Observable<Object>{
    return this.HttpClient.delete(`${this.baseUrl}/${id}`, { headers: this.header});
  }
  
}
