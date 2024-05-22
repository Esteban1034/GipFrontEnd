import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FaseProyecto } from '../model/fase-proyecto';
import { HttpHeaderApp } from './header';


@Injectable({
  providedIn: 'root'
})
export class FaseProyectoService {

  private baseUrl = environment.baseUrl + '/proyectos/fases';

  constructor(private httpClient: HttpClient, private headers: HttpHeaderApp) { }
  
  private header = this.headers.headerPrivate();

  getFases(): Observable<FaseProyecto[]> {
    return this.httpClient.get<FaseProyecto[]>(`${this.baseUrl}`, { headers: this.header});
  }

  createFase(fase: FaseProyecto): Observable<Object> {
    return this.httpClient.post(`${this.baseUrl}`, fase, { headers: this.header});
  }

  updateFase(id: number, fase: FaseProyecto):Observable<Object> {
    return this.httpClient.put(`${this.baseUrl}/${id}`, fase, { headers: this.header});
  }

  getFaseById(id: number):Observable<FaseProyecto> {
    return this.httpClient.get<FaseProyecto>(`${this.baseUrl}/${id}`, { headers: this.header});
  }

  deleteFase(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.baseUrl}/${id}`, { headers: this.header});
  }

  findByProyectoAndBase(id: number): Observable<FaseProyecto[]> {
    return this.httpClient.get<FaseProyecto[]>(`${this.baseUrl}/proyecto/${id}`, { headers: this.header});
  }

  findByProyectoActividadAsig(idProyecto: number): Observable<FaseProyecto[]> {
    return this.httpClient.get<FaseProyecto[]>(`${this.baseUrl}/actividad/proyecto/${idProyecto}`, { headers: this.header});
  }

}
