import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ComponenteDesarrollo } from '../Model/componente-desarrollo';
import { HttpHeaderApp } from './header';

@Injectable({
  providedIn: 'root'
})
export class ComponenteDesarrolloService {

  private baseUrl = environment.baseUrl + "/proyectos/componentes";

  constructor(private httpClient: HttpClient, private headers: HttpHeaderApp) { }
  
  private header = this.headers.headerPrivate();

  getComponentesList(): Observable<ComponenteDesarrollo[]> {
    return this.httpClient.get<ComponenteDesarrollo[]>(`${this.baseUrl}`, { headers: this.header});
  }

  createComponente(componente: ComponenteDesarrollo): Observable<Object> {
    return this.httpClient.post(`${this.baseUrl}`, componente, { headers: this.header});
  }
  
  getComponenteById(id: number): Observable<ComponenteDesarrollo>{
    return this.httpClient.get<ComponenteDesarrollo>(`${this.baseUrl}/${id}`, { headers: this.header});
  }

  updateComponente(id: number, componente: ComponenteDesarrollo): Observable<Object>{
    return this.httpClient.put(`${this.baseUrl}/${id}`, componente, { headers: this.header});
  }

  deleteComponente(id: number): Observable<Object>{
    return this.httpClient.delete(`${this.baseUrl}/${id}`, { headers: this.header});
  }

}