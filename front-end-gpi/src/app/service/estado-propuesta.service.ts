import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EstadoPropuesta } from '../model/estado-propuesta';
import { HttpHeaderApp } from './header';

@Injectable({
  providedIn: 'root'
})
export class EstadoPropuestaService {

  private baseUrl = environment.baseUrl + "/proyectos/estados-propuesta";

  constructor(private httpClient: HttpClient, private headers: HttpHeaderApp) { }
  
  private header = this.headers.headerPrivate();

  getEstadosList(): Observable<EstadoPropuesta[]> {
    return this.httpClient.get<any[]>(`${this.baseUrl}`, { headers: this.header});
  }

  getEstadoById(id: number): Observable<EstadoPropuesta> {
    return this.httpClient.get<EstadoPropuesta>(`${this.baseUrl}/${id}`, {headers: this.header});
  }

}