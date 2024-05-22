import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Novedad } from '../model/novedad';
import { HttpHeaderApp } from './header';

@Injectable({
  providedIn: 'root'
})
export class NovedadService {

  private baseUrl = environment.baseUrl + "/empleados/novedades";

  constructor(private httpClient: HttpClient, private headers: HttpHeaderApp) { }
  
  private header = this.headers.headerPrivate();

  getNovedadesList(): Observable<Novedad[]> {
    return this.httpClient.get<any[]>(`${this.baseUrl}`, { headers: this.header});
  }

  createNovedad(novedad: any): Observable<Object> {
    return this.httpClient.post(`${this.baseUrl}`, novedad, { headers: this.header});
  }

  getNovedadById(id: number): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/${id}`, { headers: this.header});
  }

  updateNovedad(id: number, novedad: any): Observable<Object> {
    return this.httpClient.put(`${this.baseUrl}/${id}`, novedad, { headers: this.header});
  }

  findByEmpleado(id: number): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.baseUrl}/empleado/${id}`, { headers: this.header});
  }

  deleteNovedad(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.baseUrl}/${id}`, { headers: this.header});
  }


}