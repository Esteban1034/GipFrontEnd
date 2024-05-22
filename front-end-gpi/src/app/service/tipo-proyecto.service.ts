import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TipoProyecto } from '../Model/tipo-proyecto';
import { HttpHeaderApp } from './header';

@Injectable({
  providedIn: 'root'
})
export class TipoProyectoService {

  private baseUrl = environment.baseUrl + "/proyectos/tipos";

  constructor(private httpClient: HttpClient, private headers: HttpHeaderApp) { }
  
  private header = this.headers.headerPrivate();

  getTiposList(): Observable<TipoProyecto[]> {
    return this.httpClient.get<TipoProyecto[]>(`${this.baseUrl}`, { headers: this.header});
  }

  createTipo(tipo: TipoProyecto): Observable<Object>{
    return this.httpClient.post(`${this.baseUrl}`,tipo, { headers: this.header});
  }
  
  getTipoById(id: number): Observable<TipoProyecto>{
    return this.httpClient.get<TipoProyecto>(`${this.baseUrl}/${id}`, { headers: this.header});
  }

  updateTipo(id: number, tipo: TipoProyecto): Observable<Object>{
    return this.httpClient.put(`${this.baseUrl}/${id}`, tipo, { headers: this.header});
  }

  deleteTipo(id: number): Observable<Object>{
    return this.httpClient.delete(`${this.baseUrl}/${id}`, { headers: this.header});
  }

}